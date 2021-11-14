import { useState } from "react";
import CustomInput from "./components/CustomInput";
import InputTimeAgo from "./components/InputTimeAgo";
import Suggests from "./components/Suggests";

function App() {
  const [text, setText] = useState('')


  return (
    <main >
      <CustomInput text={text} onChange={setText}/>
      <InputTimeAgo text={text}/>
      <Suggests text={text} />
    </main>
  )
}

export default App
