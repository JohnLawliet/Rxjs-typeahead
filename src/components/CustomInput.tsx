import { useObservableCallback, useSubscription } from "observable-hooks";
import { Dispatch, FC, SetStateAction } from "react";
import { pluck } from "rxjs";

interface ITextProps {
    text: string
    onChange: Dispatch<SetStateAction<string>>
}

const CustomInput:FC<ITextProps> = (props) => {
    const [onChange, textChange$] = useObservableCallback<string,React.FormEvent<HTMLInputElement>>(
        event$ => event$.pipe(
            pluck('currentTarget', 'value')
    ))

  useSubscription(textChange$, props.onChange)
  return (
    <div className=" p-2 flex border border-gray-200 m-2">
      <input 
        type="text" 
        onChange={onChange} 
        className="px-3 py-2 bg-gray-100 flex-grow outline-none"
        placeholder="Text here"
        value={props.text}
      />
    </div>
  )
}

export default CustomInput
