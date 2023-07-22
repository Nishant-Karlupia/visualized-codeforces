// @Nishant-Karlupia
// visualised-codeforces
// stats: it provide the links for the submission of solved problems by the user
// it remains to build 

import React from 'react'
import { useState } from 'react';
import ProblemItem from './ProblemItem';

const Stats = (props) => {
    const [handle, setHandle] = useState("");
    // const [new_handle, setNew_handle] = useState("");
    const [user_exists, setUser_exists] = useState(0);
    const [solved, setSolved] = useState([]);

    const handleSubmit = async (ev) => {
        props.setProgress(5);
        ev.preventDefault();
        setUser_exists(0);

        const response = await fetch(`https://codeforces.com/api/user.status?handle=${handle}`, {
            method: 'GET',
        });
        props.setProgress(25);

        const json = await response.json();
        if (json.status === "OK") {
            setHandle(handle);
            setUser_exists(1);
        }
        else {
            props.setProgress(100);
            alert("Couldn't find user!!!");
            return;
        }
        // console.log(json['result'][0]["problem"]['problemsetName']);
        const solved=[],solvedkey={};
        props.setProgress(100);
        for(let res of json["result"])
        {
            if(res["problem"]["problemsetName"]!==undefined)continue;
            // console.log(res);
            if(res["verdict"]==="OK")
            {
                let rat = (res["problem"]["rating"] === undefined ? 0 : res["problem"]["rating"]);
                // unkey: a unique key required to target each question independently 
                // unkey= contest_id + index + rating , (index: "A","B",...)
                // as rating may be undefined for some problems so we made it 0(if it not exists)
                const qkey = res["problem"]["contestId"] + "*=*" + res["problem"]["index"] + "*=*" +res["problem"]["name"] +"*=*"+rat;
                const skey= (res["problem"]["contestId"]).toString() +"*=*"+ (res["id"]).toString();
                const key=qkey+"+===+"+skey;
                if(qkey in solvedkey)continue;
                solved.push(key);
                solvedkey[qkey]=1;
            }
            // if(key in solved)
        }
        console.log( solved.length);
        setSolved(solved);
    }

    const onchange = (ev) => {
        setHandle(ev.target.value);
    }


    return (
        <div className='d-flex flex-column'>
            <div className='container d-flex justify-content-center handle-name my-4'>
                <div className='w-50' >
                    <form onSubmit={handleSubmit}>
                        <input className='handle-input' type="text" value={handle} name="handle" onChange={onchange} placeholder="Codeforces user handle"></input>
                        {/* <button type="submit">Submit</button> */}
                    </form>
                </div>
            </div>
            {user_exists===1?<>
            <div className='container' style={{"maxWidth":"600px","textAlign":"center","fontFamily":"consolas","fontSize":"20px"}}>
                Solved Problems
            </div>
            {
                solved.map((key)=>{
                    const problem=key.split("+===+")[0];
                    const submission=key.split("+===+")[1];
                    const prlst=problem.split("*=*"),sublst=submission.split("*=*");
                    const contest=prlst[0],pindex=prlst[1],pname=prlst[2],rat=prlst[3],subId=sublst[1];
                    return <ProblemItem key={key} contest={contest} rating={rat} subId={subId} pname={pname} pindex={pindex} />
                })
            }
            </>:<></>}
            
        </div>
    )
}

export default Stats