// GOOD: Moved outside so it doesn't get destroyed
const CustomInput = ({ text, setText }) => {
  return <TextInput value={text} onChangeText={setText} />;
};

export default function MyScreen() {
  const [text, setText] = useState('');

  return (
    <View>
      <CustomInput text={text} setText={setText} /> 
    </View>
  );
}
