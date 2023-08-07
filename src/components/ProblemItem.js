import React from "react";

const ProblemItem = (props) => {
  return (
    <div
      className="container"
      style={{ maxWidth: "800px", border: "0px solid red" }}
    >
      <div className=" stats-solved-container">
        <div>
          <span style={{ border: "0px solid green" }}>
            <a
              href={`https://codeforces.com/problemset/status/${props.contest}/problem/${props.pindex}`}
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noreferrer"
            >
              {props.rating}
            </a>
          </span>{" "}
          | {props.pindex} . <span style={{ border: "0px solid green" }}>
            <a
              href={`https://codeforces.com/problemset/problem/${props.contest}/${props.pindex}`}
              style={{ textDecoration: "none" }}
              target="_blank"
              rel="noreferrer"
            >
              {props.pname}
            </a>
          </span>
        </div>
        <div style={{ border: "0px solid green" }}>
          <a
            href={`https://codeforces.com/contest/${props.contest}/submission/${props.subId}`}
            style={{ textDecoration: "none" }}
            target="_blank"
            rel="noreferrer"
          >
            {props.subId}
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProblemItem;
