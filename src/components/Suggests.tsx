import { useObservable, useObservableState } from "observable-hooks";
import { FC, useState } from "react";
import { switchMap, map, debounceTime, tap, skipWhile, from, EMPTY, catchError, iif, of } from "rxjs";

interface ISuggests{
    text: string
}

interface IActive {
    link: string
    name: string
}

type WikipediaResult = string[]

const true$ = (inp:any) => {
    return from<Promise<WikipediaResult>>(
        fetch(
          `https://en.wikipedia.org/w/api.php?action=opensearch&origin=*&search=${inp}`,
          { mode: 'cors' }
        ).then(t => t.json())
      ).pipe(
        map(item => {
            let formattedResult=[]
            for(let i=0; i<10; i++){
                formattedResult.push({
                    name: item[1][i], 
                    link: item[3][i]
                })
            }
            return formattedResult
        }),
        catchError(() => EMPTY)
      )
}

const Suggests:FC<ISuggests> = (props) => {
    const [isActive, setIsActive] = useState<IActive | null>(null)

    const results = useObservableState(
        useObservable($inp => $inp.pipe(
            skipWhile(val => val[0]===''),
            debounceTime(1000),
            switchMap((inp) => iif(
                () => inp[0] === '', of([]), true$(inp[0])
            ) ),
            tap(val => console.log(val))
        )        
        ,[props.text])
    )
    
    return (
        <div className="flex flex-col md:grid md:grid-cols-3">
            <div className={isActive? "col-span-1" : "col-span-3"}>
            {
                results?.length!==0 && results?.map(item => (
                    <div key={item.name} className={`my-2 rounded-md shadow-md p-1 md:p-5 cursor-pointer ${isActive?.name===item.name? "bg-gray-200" : "bg-gray-50"}`} onClick={() => setIsActive(item)}>
                        <span className={`text-base md:text-xl font-medium md:font-extrabold `}>{item.name}</span>
                    </div>
                ))
            }
            </div>
            {
                isActive &&
                <iframe src={isActive.link} title={isActive.name} className="col-span-2 h-screen md:h-full w-full" loading="lazy" allowFullScreen={true}>

                </iframe>
            }
        </div>
    )
}

export default Suggests
