import React from 'react'

const ProblemItem = (props) => {
  return (
    <div className='container' style={{"maxWidth":"800px"}}>
        <div className=' stats-solved-container'>
          <div >
            {props.rating} | {props.pindex} . {props.pname}
          </div>
          <div style={{"border":"0px solid green"}}>
            <a href={`https://codeforces.com/contest/${props.contest}/submission/${props.subId}`} style={{ "textDecoration": "none" }} target="_blank" rel="noreferrer">{props.subId}</a>
          </div>
        </div>
    </div>
  )
}

export default ProblemItem