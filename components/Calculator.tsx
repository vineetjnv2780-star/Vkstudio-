import React, { useState, useEffect } from 'react';
import { Delete } from 'lucide-react';

export const Calculator: React.FC = () => {
  // Initialize state from localStorage to persist data across app switches
  const [display, setDisplay] = useState(() => localStorage.getItem('vk_calc_display') || '0');
  const [prev, setPrev] = useState<string | null>(() => localStorage.getItem('vk_calc_prev') || null);
  const [op, setOp] = useState<string | null>(() => localStorage.getItem('vk_calc_op') || null);
  const [shouldReset, setShouldReset] = useState(() => localStorage.getItem('vk_calc_reset') === 'true');

  // Persist state changes
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
    // localStorage will be updated by useEffects
  };

  const btnClass = "h-16 w-16 rounded-3xl text-2xl font-medium flex items-center justify-center transition-all duration-200 active:scale-90 shadow-lg";
  const numClass = `${btnClass} bg-zinc-800 text-white hover:bg-zinc-700`;
  const opClass = `${btnClass} bg-amber-500 text-white hover:bg-amber-400 shadow-amber-500/20`;
  const funcClass = `${btnClass} bg-zinc-300 text-zinc-900 hover:bg-white`;

  return (
    <div className="flex flex-col h-full justify-end p-6">
      <div className="flex-1 flex flex-col items-end justify-end mb-8 space-y-2">
         <div className="text-gray-400 text-lg h-6">{prev} {op}</div>
         <div className="text-6xl font-light text-white tracking-tight break-all text-right w-full">
            {display}
         </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
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
        
        <button className={`${numClass} col-span-2 w-full`} onClick={() => handleNum('0')}>0</button>
        <button className={numClass} onClick={() => handleNum('.')}>.</button>
        <button className={`${opClass} bg-gradient-to-br from-amber-500 to-orange-600`} onClick={calculate}>=</button>
      </div>
    </div>
  );
};