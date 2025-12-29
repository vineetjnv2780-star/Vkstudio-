import React, { useState, useEffect } from 'react';

export const Calculator: React.FC = () => {
  const [display, setDisplay] = useState(() => localStorage.getItem('vk_calc_display') || '0');
  const [prev, setPrev] = useState<string | null>(() => localStorage.getItem('vk_calc_prev') || null);
  const [op, setOp] = useState<string | null>(() => localStorage.getItem('vk_calc_op') || null);
  const [shouldReset, setShouldReset] = useState(() => localStorage.getItem('vk_calc_reset') === 'true');

  useEffect(() => {
    localStorage.setItem('vk_calc_display', display);
  }, [display]);

  useEffect(() => {
    if (prev !== null) localStorage.setItem('vk_calc_prev', prev);
    else localStorage.removeItem('vk_calc_prev');
  }, [prev]);

  useEffect(() => {
    if (op !== null) localStorage.setItem('vk_calc_op', op);
    else localStorage.removeItem('vk_calc_op');
  }, [op]);

  useEffect(() => {
    localStorage.setItem('vk_calc_reset', String(shouldReset));
  }, [shouldReset]);

  const handleNum = (num: string) => {
    if (display === '0' || shouldReset) {
      setDisplay(num);
      setShouldReset(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOp = (operation: string) => {
    setPrev(display);
    setOp(operation);
    setShouldReset(true);
  };

  const calculate = () => {
    if (!prev || !op) return;
    const current = parseFloat(display);
    const previous = parseFloat(prev);
    let result = 0;

    switch (op) {
      case '+': result = previous + current; break;
      case '-': result = previous - current; break;
      case '×': result = previous * current; break;
      case '÷': result = previous / current; break;
    }

    setDisplay(result.toString());
    setOp(null);
    setPrev(null);
    setShouldReset(true);
  };

  const clear = () => {
    setDisplay('0');
    setPrev(null);
    setOp(null);
  };

  // Premium Button Styles
  const btnBase = "h-20 w-20 rounded-full text-3xl font-normal flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg select-none";
  const numClass = `${btnBase} bg-zinc-800 text-white hover:bg-zinc-700`;
  const opClass = `${btnBase} bg-amber-500 text-white hover:bg-amber-400 shadow-amber-500/20`;
  const funcClass = `${btnBase} bg-zinc-300 text-zinc-900 hover:bg-white`;
  const zeroClass = "h-20 w-full rounded-full text-3xl font-normal flex items-center justify-start pl-8 bg-zinc-800 text-white hover:bg-zinc-700 transition-all duration-200 active:scale-95 shadow-lg select-none";

  return (
    <div className="flex flex-col h-full justify-end p-6 pb-12">
      <div className="flex-1 flex flex-col items-end justify-end mb-8 space-y-2 pr-4">
         <div className="text-gray-400 text-xl h-8 font-light">{prev} {op}</div>
         <div className="text-7xl font-light text-white tracking-tight break-all text-right w-full">
            {display}
         </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4 place-items-center">
        <button className={funcClass} onClick={clear}>AC</button>
        <button className={funcClass} onClick={() => setDisplay(parseFloat(display) * -1 + "")}>+/-</button>
        <button className={funcClass} onClick={() => setDisplay(parseFloat(display) / 100 + "")}>%</button>
        <button className={opClass} onClick={() => handleOp('÷')}>÷</button>
        
        <button className={numClass} onClick={() => handleNum('7')}>7</button>
        <button className={numClass} onClick={() => handleNum('8')}>8</button>
        <button className={numClass} onClick={() => handleNum('9')}>9</button>
        <button className={opClass} onClick={() => handleOp('×')}>×</button>
        
        <button className={numClass} onClick={() => handleNum('4')}>4</button>
        <button className={numClass} onClick={() => handleNum('5')}>5</button>
        <button className={numClass} onClick={() => handleNum('6')}>6</button>
        <button className={opClass} onClick={() => handleOp('-')}>-</button>
        
        <button className={numClass} onClick={() => handleNum('1')}>1</button>
        <button className={numClass} onClick={() => handleNum('2')}>2</button>
        <button className={numClass} onClick={() => handleNum('3')}>3</button>
        <button className={opClass} onClick={() => handleOp('+')}>+</button>
        
        <div className="col-span-2 w-full">
            <button className={zeroClass} onClick={() => handleNum('0')}>0</button>
        </div>
        <button className={numClass} onClick={() => handleNum('.')}>.</button>
        <button className={`${opClass} bg-gradient-to-br from-amber-500 to-orange-600`} onClick={calculate}>=</button>
      </div>
    </div>
  );
};