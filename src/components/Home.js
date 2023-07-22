// @Nishant karlupia
// the home of the website: importing the nesccessary
// used react for frontend and react-google-charts for plotting bargraphs,pie-charts,...etc

import React from 'react'
import { useState } from 'react';
import { Chart } from "react-google-charts";

const Home = (props) => {

    // handle: it stores the username provided
    const [handle, setHandle] = useState("");
    // new_handle: user name on the charts will not change untill we procees the request, otherwise if we replace the just username it changes the name in the chart even without processing the request
    const [new_handle, setNew_handle] = useState("");
    // user_exists: check if the username provided exists: case-insensitive as per codeforces
    const [user_exists, setUser_exists] = useState(0);
    // verdict_column: it stores the data related to verdicts of the submissions made by the user
    const [verdict_columns, setVerdict_columns] = useState([]);
    // language_column: it stores the data related to languages used by the user
    const [language_column, setLanguage_column] = useState([]);
    // tags: it stores the problem tags of the problems attempted by the user
    const [tags, setTags] = useState([]);
    // ḷevels: it stores the problem levels of all problems attempted by the user ['A','B','C',...]
    const [levels, setLevels] = useState([]);
    // rating : it stores the problem ratings [800,900,1000,...]
    const [rating, setRating] = useState([]);
    // contest: it stores the contest related info [only available if user has attempted at least one contest]
    const [contest, setContest] = useState({ total: 0, best_rank: 0, best_rank_con: "", worst_rank: 0, worst_rank_con: "", maxUp: 0, maxUpCon: "", maxDown: 0, maxDownCon: "" });
    // unsolved: it stores the problems attempted by the user but still can't be solved 
    const [unsolved, setUnsolved] = useState([]);
    // rating_bar_width: bar-width related data(can be extended to all bar-graphs)
    const [rating_bar_width, setRating_bar_width] = useState(1200);


    // chart[type='bar'] requires 2d data first column of which must be the two meaningful labels used by the graph and rest is the data 
    // I have used ...arr notation for data destructuring

    // *************verdicts****************
    const verdict_data = [
        ["Verdicts", "Verdict Count"],
        ...verdict_columns
    ];
    

    const verdict_options = {
        title: `Verdicts of ${handle}`,
        is3D: true,
        legend: 'none',
        slices: {
            1: { color: 'rgb(33, 209, 6)' },
            5: { color: 'rgb(255,10,10)' },
            7: { color: 'rgb(56, 154, 235)' },
        },
        // pieSliceText: 'label',
    };
    // *************************************

    // *************languages***************
    const language_data = [
        ["Languages", "Language Count"],
        ...language_column
    ];


    const language_options = {
        title: `Languages of ${handle}`,
        is3D: true,
        legend: 'none',
        // pieSliceText: 'label',

    };
    // *************************************

    // ****************tags*****************
    const tag_data = [
        ["Tags", "Tag Count"],
        ...tags
    ];


    const tag_options = {
        title: `Tags of ${handle}`,
        // legend: 'none',
        pieHole: 0.5,
        pieSliceText: "none",

    };

    // *************************************

    // ***************levels****************
    const level_data = [
        ["", "solved"],
        ...levels
    ];


    const level_options = {
        chart: {
            title: `Levels of ${handle}`,
            // subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
        legend: { position: "none" },
        bar: { groupWidth: "0%" },
        chartArea: { left: 100, top: 100, width: '95%', height: '55%' },
        
    };
    // *************************************
    // *************Ratings*****************
    const rating_data = [
        ["", "solved"],
        ...rating
    ];


    const rating_options = {
        chart: {
            title: `Problem ratings of ${handle}`,
            // subtitle: "Sales, Expenses, and Profit: 2014-2017",
        },
        // width:"100%",
        legend: { position: "none" },
    };
    // *************************************



    const handleSubmit = async (ev) => {
        props.setProgress(5);
        ev.preventDefault();
        setUser_exists(0);
        
        const response = await fetch(`https://codeforces.com/api/user.status?handle=${new_handle}`, {
            method: 'GET',
        });
        props.setProgress(25);
        
        const json = await response.json();
        if(json.status==="OK")
        {
            setHandle(new_handle);
            setUser_exists(1);
        }
        else
        {
            props.setProgress(100);
            alert("Couldn't find user!!!");
            return;
        }
        props.setProgress(35);
        
        // *************verdicts-and-languages**************************
        let verdicts = {"FAILED":0, "OK":0, "PARTIAL":0, "COMPILATION_ERROR":0, "RUNTIME_ERROR":0, "WRONG_ANSWER":0, "PRESENTATION_ERROR":0, "TIME_LIMIT_EXCEEDED":0, "MEMORY_LIMIT_EXCEEDED":0, "IDLENESS_LIMIT_EXCEEDED":0, "SECURITY_VIOLATED":0, "CRASHED":0, "INPUT_PREPARATION_CRASHED":0, "CHALLENGED":0, "SKIPPED":0, "TESTING":0, "REJECTED":0}, languages = {};
        for (let res of json['result']) {
            if (res["verdict"]==="" || res["verdict"]===undefined);
            else verdicts[res['verdict']]+= 1;
            
            if (res["programmingLanguage"] in languages) languages[res["programmingLanguage"]] += 1;
            else languages[res["programmingLanguage"]] = 1;
            
        }
        // react-google-charts expected "data" in form of 2d list
        // verdict_final: converting verdict(dictionary type) to 2d list [["Ok":100],["failed":0],..]
        let verdict_final = [];
        // language_final: same as verdict_final but for languages
        let language_final = [];
        
        let verdict_keys = Object.keys(verdicts);
        let languages_keys = Object.keys(languages);
        
        
        verdict_keys.forEach((ver) => {
            let tmp = [ver, verdicts[ver]];
            verdict_final.push(tmp);
        });
        languages_keys.forEach((lang) => {
            let tmp = [lang, languages[lang]];
            language_final.push(tmp);
        });
        // console.log(verdict_final);
        
        setVerdict_columns(verdict_final);
        setLanguage_column(language_final);
        // ****************************************
        
        // *********************tags-levels(index)-ratings********************
        let all_tags = {}, all_levels = [], all_ratings = [];
        for (let res of json['result']) {
            for (let tag of res["problem"]["tags"]) {
                if (tag in all_tags) all_tags[tag] += 1;
                else all_tags[tag] = 1;
            }
            if (res["problem"]["index"][0] in all_levels) all_levels[res['problem']['index'][0]] += 1;
            else all_levels[res['problem']['index'][0]] = 1;
            
            if(res["problem"]["rating"]!==undefined)
            {
                if (res["problem"]["rating"] in all_ratings) all_ratings[res["problem"]["rating"]] += 1;
                else all_ratings[res["problem"]["rating"]] = 1;
            }
            
        }
        // ṭag_final,level_final,rating_final: used to convert the data we got(map) to 2d data structure as react-google-charts expected 2d list as data
        let tag_final = [], level_final = [], rating_final = [];
        let tag_keys = Object.keys(all_tags);
        let level_keys = Object.keys(all_levels);
        let rating_keys = Object.keys(all_ratings);
        
        
        tag_keys.forEach((tag) => {
            let tmp = [tag, all_tags[tag]];
            tag_final.push(tmp);
        });
        level_keys.forEach((level) => {
            let tmp = [level, all_levels[level]];
            level_final.push(tmp);
        });
        
        rating_keys.forEach((rating) => {
            let tmp = [rating, all_ratings[rating]];
            rating_final.push(tmp);
            rating_final.push([" ",""]);
        });
        
        
        setRating_bar_width(1000+(rating_final.length)*20)
        
        
        level_final.sort();
        // rating_final.sort();
        
        setTags(tag_final);
        setLevels(level_final);
        setRating(rating_final);
        
        // *******************************************************************

        // *************************unsolved-problems*************************
        // traverse through all the unique problems attempted by the user
        // make an array that keeps check if a problem solved in any attempt by the user
        // at the end mark all the uniques unsolved problems as our interest data

        let unsolved_final = [], all_unsolved = {};
        for (let res of json['result']) {
            let rat = (res["problem"]["rating"] === undefined ? 0 : res["problem"]["rating"]);
            // unkey: a unique key required to target each question independently 
            // unkey= contest_id + index + rating , (index: "A","B",...)
            // as rating may be undefined for some problems so we made it 0(if it not exists)
            const unkey = res["problem"]["contestId"] + "+=" + res["problem"]["index"] + "+=" + rat;
            if (res["verdict"] === "OK") all_unsolved[unkey] = 1;
            else {
                if ((unkey in all_unsolved) && (all_unsolved[unkey] === 1)) continue;
                else all_unsolved[unkey] = 0;
            }
        }
        let unsolved_keys = Object.keys(all_unsolved);
        unsolved_keys.forEach((key) => {
            if (all_unsolved[key] === 0) unsolved_final.push(key);
        })
        setUnsolved(unsolved_final);
        props.setProgress(75);
        
        
        // *******************************************************************
        
        
        // **************get-contest-related-detailes*************************
        const req = await fetch(`https://codeforces.com/api/user.rating?handle=${new_handle}`, {
            method: 'GET',
        });
        const data = await req.json();
        props.setProgress(95);
        let best = 1e9, worst = -1e9, maxUp = 0, maxDown = 0, bestCon = "", worstCon = "", maxUpCon = "", maxDownCon = "", totalCon = data.result.length;
        
        data.result.forEach(function (con) {
            if (con.rank < best) {
                best = con.rank;
                bestCon = con.contestId;
            }
            if (con.rank > worst) {
                worst = con.rank;
                worstCon = con.contestId;
            }
            let change = con.newRating - con.oldRating;
            if (change > maxUp) {
                maxUp = change;
                maxUpCon = con.contestId;
            }
            if (change < maxDown) {
                maxDown = change;
                maxDownCon = con.contestId;
            }
        });
        
        setContest({ total: totalCon, best_rank: best, best_rank_con: bestCon, worst_rank: worst, worst_rank_con: worstCon, maxUp: maxUp, maxUpCon: maxUpCon, maxDown: maxDown, maxDownCon: maxDownCon });
        
        props.setProgress(100);
        
        // *******************************************************************
        
    }

    const onchange = (ev) => {
        setNew_handle(ev.target.value);
    }

    return (
        <div className='d-flex flex-column'>
            <div className='container d-flex justify-content-center handle-name my-4'>
                <div className='w-50' >
                    <form onSubmit={handleSubmit}>
                        <input className='handle-input' type="text" value={new_handle} name="new_handle" onChange={onchange} placeholder="Codeforces user handle"></input>
                        {/* <button type="submit">Submit</button> */}
                    </form>
                </div>
            </div>
            {user_exists===1?
            <><div className='pie-container  w-70'>
                    <div className=' mx-3 my-3 pie-chart'>
                        <Chart
                            chartType="PieChart"
                            data={verdict_data}
                            options={verdict_options}
                            width="400px"
                            height={"400px"} />
                    </div>
                    <div className='mx-3 my-3 pie-chart'>
                        <Chart
                            chartType="PieChart"
                            data={language_data}
                            options={language_options}
                            width="400px"
                            height={"400px"} />
                    </div>
                </div>
                <div className="tags-container my-3">
                        <Chart
                            chartType="PieChart"
                            data={tag_data}
                            options={tag_options}
                            width={"1000px"}
                            height={"550px"} />
                </div>
                <div className='level-container my-5'>
                        <Chart
                            chartType="Bar"
                            data={level_data}
                            options={level_options}
                            width={"1000px"}
                            height="450px" />
                </div>
                <div className='rating-container my-2'>
                        <Chart
                            chartType="Bar"
                            data={rating_data}
                            options={rating_options}
                            width={`${rating_bar_width}px`}
                            height="450px" />
                </div>
                <div className='my-3 contest-container'>
                    <table className="table">
                        <thead>
                            <tr style={{ "backgroundColor": "#607D8B" }}>
                                <th className='td-1'>Contest of</th>
                                <th className='td-2'>{handle}</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className='td-1'>Number of Contest</td>
                                <td className='td-2'>{contest.total}</td>
                            </tr>
                            <tr>
                                <td className='td-1'>Best Rank</td>
                                <td className='td-2'>{contest.best_rank}<a rel="noreferrer" href={`https://codeforces.com/contest/${contest.best_rank_con}`} style={{ "textDecoration": "none" }} target="_blank"> ({contest.best_rank_con})</a></td>
                            </tr>
                            <tr>
                                <td className='td-1'>Worst Rank</td>
                                <td className='td-2'>{contest.worst_rank}<a rel="noreferrer" href={`https://codeforces.com/contest/${contest.worst_rank_con}`} style={{ "textDecoration": "none" }} target="_blank"> ({contest.worst_rank_con})</a></td>
                            </tr>
                            <tr>
                                <td className='td-1'>Max Up</td>
                                <td className='td-2'>{contest.maxUp}<a rel="noreferrer" href={`https://codeforces.com/contest/${contest.maxUpCon}`} style={{ "textDecoration": "none" }} target="_blank"> ({contest.maxUpCon})</a></td>
                            </tr>
                            <tr>
                                <td className='td-1'>Max Down</td>
                                <td className='td-2'>{contest.maxDown}<a rel="noreferrer" href={`https://codeforces.com/contest/${contest.maxDownCon}`} style={{ "textDecoration": "none" }} target="_blank"> ({contest.maxDownCon})</a></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>
                    <div className="unsolved-parent d-flex flex-column">
                        <h2 className='mb-4' style={{ "fontFamily": "consolas" }}>Unsolved</h2>
                        <div className="unsolved-container">

                            {unsolved.map((unkey) => {

                                return <div key={unkey}> <a href={`https://codeforces.com/contest/${unkey.split("+=")[0]}/problem/${unkey.split("+=")[1]}`} style={{ "textDecoration": "none" }} target="_blank" rel="noreferrer">{unkey.split("+=")[0]}-{unkey.split("+=")[1]}</a> </div>;

                            })}
                    </div>
                </div></>:<></>}
        </div>
    )
}

export default Home
