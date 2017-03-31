/**
 * Created by liaopeng on 17/3/23.
 */
const initstate={c:0}

export const jishuan=(s=initstate,a)=>{
    switch (a.mytype){
        case 'TEST':
            return {c:s.c+a.number}
        default:
            return s
    }

}