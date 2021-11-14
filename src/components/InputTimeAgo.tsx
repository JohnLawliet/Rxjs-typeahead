import { FC } from "react";
import {useObservable, useObservableState} from 'observable-hooks'
import { debounceTime, interval, map, startWith, switchMap } from "rxjs";

interface IProps{
    text:string
}

const InputTimeAgo:FC<IProps> = (props) => {
    // useObservableState is for showing the result of observable
    // useObservable requires its dependencies defined. These will get passed onto the observable
    const secondsAgo = useObservableState(
        useObservable($inp => $inp.pipe(
            debounceTime(300),
            switchMap(() => interval(1000).pipe(
                startWith(-1),
                map(count => fromNow(count + 1))
            ))
        ), [props.text])        
    )

    function fromNow(diff: number): string {
        const minute = (diff / 60) | 0
        const second = diff - minute * 60
        const mstr =
          minute < 1 ? '' : minute === 1 ? `a minute and ` : `${minute} minutes and `
        const sstr =
          second < 1
            ? 'just now'
            : second === 1
            ? `a second ago`
            : `${second} seconds ago`
        return mstr + sstr
      }

    return (
        <p className="py-2">
            You typed {props.text ? `"${props.text}"` : 'nothing'} {secondsAgo}.
        </p>
    )
}

export default InputTimeAgo
