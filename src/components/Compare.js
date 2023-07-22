//@Nishant-Karlupia
// compare: to compare the progress/stast of two user based on some parameters supported by the website 
// frontend: react, plotting: react-google-charts

import React from 'react'
import { useState } from 'react';
import { Chart } from "react-google-charts";

const Compare = (props) => {


  // handle: it stores the two handle/username provided
  const [handle, setHandle] = useState({ handle1: "", handle2: "" });
  // new_handle: for preserving the previous handle until we process for the new request
  const [new_handle, setNew_handle] = useState({ handle1: "", handle2: "" });
  // unsolved: get total unsolved problems of both the user
  // we can also get total solved problems by subtracting total unsolved from the total attempted problems
  const [unsolved, setUnsolved] = useState({ handle1: "", handle2: "" });
  // solvedwithone: it will store the number of problems solved by the users in their first attempt
  const [solvedwithone, setSolvedwithone] = useState({ handle1: "", handle2: "" });
  // triedsolved: it store the combination of problems tried and that are solve
  const [triedsolved, setTriedsolved] = useState({ handle1: [], handle2: [] });
  // userlevels: levels ['A','B',...] of problems both the user have solved 
  const [userlevels, setUserlevels] = useState([]);
  // userratings: problem ratings of solved problems
  const [userratings, setUserratings] = useState([]);
  // usertags: all tags combined from all problems
  const [usertags, setUsertags] = useState([]);
  // user_exist: check if both the user exist: case-insensitive search as per codeforces search algorithm
  const [user_exist, setUser_exist] = useState(0)

  const handlerequest = async (ev) => {
    props.setProgress(5);

    const response_1 = await fetch(`https://codeforces.com/api/user.status?handle=${new_handle.handle1}`, {
      method: 'GET',
    });
    props.setProgress(15);
    let json_1 = await response_1.json();
    if (json_1.status !== "OK") {
      props.setProgress(100);
      alert(`Couldn't find ${new_handle.handle1}`);
      return;
    }
    props.setProgress(25);

    let unsolved_1 = 0, all_unsolved_1 = {}, all_tried_unique_1 = {}, solved_one_cnt_1 = 0, all_levels_1 = {}, vis_for_level_1 = {}, all_ratings_1 = {}, all_tags_1 = {};
    for (let i = json_1['result'].length - 1; i >= 0; i--) {
      let res = json_1['result'][i];
      let rat = (res["problem"]["rating"] === undefined ? 0 : res["problem"]["rating"]);
      const unkey = res["problem"]["contestId"] + "+=" + res["problem"]["index"] + "+=" + rat;
      if (res["verdict"] === "OK") {
        // unsolved
        all_unsolved_1[unkey] = 1;
        // solved
        if (unkey in all_tried_unique_1) all_tried_unique_1[unkey]++;
        else {
          all_tried_unique_1[unkey] = 1;
          solved_one_cnt_1++;
        }
        // levels of user - 1
        if (unkey in vis_for_level_1) vis_for_level_1[unkey]++;
        else vis_for_level_1[unkey] = 1;
        if (vis_for_level_1[unkey] < 2) {
          if (res["problem"]["index"][0] in all_levels_1) all_levels_1[res['problem']['index'][0]] += 1;
          else all_levels_1[res['problem']['index'][0]] = 1;
        }

        // rating of user-1
        if (vis_for_level_1[unkey] < 2 && (res["problem"]["rating"] !== undefined)) {
          if (res["problem"]["rating"] in all_ratings_1) all_ratings_1[res["problem"]["rating"]] += 1;
          else all_ratings_1[res["problem"]["rating"]] = 1;
        }

        // tags of user-1
        if (vis_for_level_1[unkey] < 2) {
          for (let tag of res["problem"]["tags"]) {
            if (tag in all_tags_1) all_tags_1[tag] += 1;
            else all_tags_1[tag] = 1;
          }
        }

      }
      else {
        // unsolved
        if ((unkey in all_unsolved_1) && (all_unsolved_1[unkey] === 1));
        else all_unsolved_1[unkey] = 0;

        // solved
        if (unkey in all_tried_unique_1);
        else {
          all_tried_unique_1[unkey] = 0;
        }

      }
    }
    let unsolved_keys_1 = Object.keys(all_unsolved_1);
    unsolved_keys_1.forEach((key) => {
      if (all_unsolved_1[key] === 0) unsolved_1 += 1;
    });
    props.setProgress(50);

    // ************user 2************
    const response_2 = await fetch(`https://codeforces.com/api/user.status?handle=${new_handle.handle2}`, {
      method: 'GET',
    });
    props.setProgress(60);

    let json_2 = await response_2.json();
    if (json_2.status !== "OK") {
      props.setProgress(100);
      alert(`Couldn't find ${new_handle.handle2}`);
      return;
    }
    setHandle({ handle1: new_handle.handle1, handle2: new_handle.handle2 });
    setUser_exist(1);
    props.setProgress(70);

    let unsolved_2 = 0, all_unsolved_2 = {}, all_tried_unique_2 = {}, solved_one_cnt_2 = 0, all_levels_2 = {}, vis_for_level_2 = {}, all_ratings_2 = {}, all_tags_2 = {};
    for (let i = json_2['result'].length - 1; i >= 0; i--) {
      let res = json_2['result'][i];
      let rat = (res["problem"]["rating"] === undefined ? 0 : res["problem"]["rating"]);
      const unkey = res["problem"]["contestId"] + "+=" + res["problem"]["index"] + "+=" + rat;
      if (res["verdict"] === "OK") {
        all_unsolved_2[unkey] = 1;
        // solved
        if (unkey in all_tried_unique_2) all_tried_unique_2[unkey]++;
        else {
          all_tried_unique_2[unkey] = 1;
          solved_one_cnt_2++;
        }
        // levels of user - 2
        if (unkey in vis_for_level_2) vis_for_level_2[unkey]++;
        else vis_for_level_2[unkey] = 1;
        if (vis_for_level_2[unkey] < 2) {
          if (res["problem"]["index"][0] in all_levels_2) all_levels_2[res['problem']['index'][0]] += 1;
          else all_levels_2[res['problem']['index'][0]] = 1;
        }

        // rating of user-2
        if (vis_for_level_2[unkey] < 2 && (res["problem"]["rating"] !== undefined)) {
          if (res["problem"]["rating"] in all_ratings_2) all_ratings_2[res["problem"]["rating"]] += 1;
          else all_ratings_2[res["problem"]["rating"]] = 1;
        }
        // tags of user-2
        if (vis_for_level_2[unkey] < 2) {
          for (let tag of res["problem"]["tags"]) {
            if (tag in all_tags_2) all_tags_2[tag] += 1;
            else all_tags_2[tag] = 1;
          }
        }

      }
      else {
        // unsolved
        if ((unkey in all_unsolved_2) && (all_unsolved_2[unkey] === 1));
        else all_unsolved_2[unkey] = 0;

        // solved
        if (unkey in all_tried_unique_2);
        else all_tried_unique_2[unkey] = 0;
      }
    }
    let unsolved_keys_2 = Object.keys(all_unsolved_2);
    unsolved_keys_2.forEach((key) => {
      if (all_unsolved_2[key] === 0) unsolved_2 += 1;
    })
    props.setProgress(85);

    setUnsolved({ handle1: unsolved_1, handle2: unsolved_2 });

    setSolvedwithone({ handle1: solved_one_cnt_1, handle2: solved_one_cnt_2 });

    // tried-solved calculations
    let tri_solve_1 = [Object.keys(all_tried_unique_1).length, Object.keys(all_tried_unique_1).length - unsolved_1];
    let tri_solve_2 = [Object.keys(all_tried_unique_2).length, Object.keys(all_tried_unique_2).length - unsolved_2];

    setTriedsolved({ handle1: tri_solve_1, handle2: tri_solve_2 });

    // levels of users
    const level_vis = {};
    let levels_array = [];
    Object.keys(all_levels_1).forEach((level) => {
      if (level in level_vis);
      else {
        level_vis[level] = 1;
        let val_1 = (all_levels_1[level]);
        let val_2 = (all_levels_2[level] === undefined) ? 0 : all_levels_2[level];
        // levels_array.push(["",,"",,""]);
        levels_array.push([level, val_1, val_1.toString(), val_2, val_2.toString()]);
      }
    });
    Object.keys(all_levels_2).forEach((level) => {
      if (level in level_vis);
      else {
        level_vis[level] = 1;
        let val_1 = (all_levels_1[level] === undefined) ? 0 : all_levels_1[level];
        let val_2 = all_levels_2[level];
        // levels_array.push(["",,"",,""]);
        levels_array.push([level, val_1, val_1.toString(), val_2, val_2.toString()]);
      }
    });

    let tmp = levels_array;
    tmp.sort();
    levels_array = [];
    for (let item of tmp) {
      // eslint-disable-next-line
      levels_array.push(["", , "", , ""]);
      levels_array.push(item);
    }
    if (levels_array.length === 0) levels_array.push(["", 0, "", 0, ""]);
    setUserlevels(levels_array);

    // ratings of users
    const rating_vis = {};
    let ratings_array = [];
    Object.keys(all_ratings_1).forEach((rat) => {
      if (rat in rating_vis);
      else {
        rating_vis[rat] = 1;
        let val_1 = (all_ratings_1[rat]);
        let val_2 = (all_ratings_2[rat] === undefined) ? 0 : all_ratings_2[rat];
        ratings_array.push([parseInt(rat), val_1, val_1.toString(), val_2, val_2.toString()]);
      }
    });
    Object.keys(all_ratings_2).forEach((rat) => {
      if (rat in rating_vis);
      else {
        rating_vis[rat] = 1;
        let val_1 = (all_ratings_1[rat] === undefined) ? 0 : all_ratings_1[rat];
        let val_2 = all_ratings_2[rat];
        ratings_array.push([parseInt(rat), val_1, val_1.toString(), val_2, val_2.toString()]);
      }
    });

    tmp = ratings_array;
    tmp.sort(function (a, b) {
      return a[0] - b[0]
    });
    ratings_array = [];
    for (let item of tmp) {
      // eslint-disable-next-line
      ratings_array.push(["", , "", , ""]);
      ratings_array.push(item);
    }
    if (ratings_array.length === 0) ratings_array.push(["", 0, "", 0, ""]);
    setUserratings(ratings_array);

    props.setProgress(95);

    // tags of users
    const tag_vis = {};
    const tags_array = [];
    Object.keys(all_tags_1).forEach((tag) => {
      if (tag in tag_vis);
      else {
        tag_vis[tag] = 1;
        let val_1 = (all_tags_1[tag]);
        let val_2 = (all_tags_2[tag] === undefined) ? 0 : all_tags_2[tag];
        tags_array.push([tag, val_1, val_1.toString(), val_2, val_2.toString()]);
        // eslint-disable-next-line
        tags_array.push(["", , "", , ""])
      }
    });
    Object.keys(all_tags_2).forEach((tag) => {
      if (tag in tag_vis);
      else {
        tag_vis[tag] = 1;
        let val_1 = (all_tags_1[tag] === undefined) ? 0 : all_tags_1[tag];
        let val_2 = all_tags_2[tag];
        tags_array.push([tag, val_1, val_1.toString(), val_2, val_2.toString()]);
        // eslint-disable-next-line
        tags_array.push(["", , "", , ""]);
      }
    });

    // tags_array.sort();   //do not sort as we have added space to make chart beautiful
    if (tags_array.length === 0) tags_array.push(["", 0, "", 0, ""]);
    setUsertags(tags_array);
    props.setProgress(100);

  }

  const handleSubmit = (ev) => {
    ev.preventDefault();
    setUser_exist(0);
    handlerequest();
  }

  const onchange = (ev) => {
    setNew_handle({ ...new_handle, [ev.target.name]: ev.target.value });
  }

  // unsolved barchart

  const unsolved_data = [
    ["", "Unsolved", { role: "style" }],
    [handle.handle1, unsolved.handle1, "rgb(14, 130, 72)"],
    [handle.handle2, unsolved.handle2, "rgb(62, 85, 168)"]
  ];

  const unsolved_options = {

    // chart:{
    title: "Unsolved",
    // },
    fontSize: 15,
    width: "100%",
    height: "100%",
    bar: { groupWidth: "30%" },
    legend: { position: "none" },
    vAxis: {
      minValue: 0,
    }
  };
  // *********************************

  // solved with one submission barChart
  const solved_with_one_data = [
    ["", "Solved", { role: "style" }],
    [handle.handle1, solvedwithone.handle1, "rgb(14, 130, 72)"],
    [handle.handle2, solvedwithone.handle2, "rgb(62, 85, 168)"]
  ];

  const solved_with_one_options = {

    // chart:{
    title: "Solved with one Submission",
    // },
    fontSize: 15,
    width: "100%",
    height: "100%",
    bar: { groupWidth: "30%" },
    legend: { position: "none" },
    vAxis: {
      minValue: 0,
    }
  };
  // ***********************************

  // tried-solved barChart
  const tried_solved_data = [
    ["Handle", `${handle.handle1}`, `${handle.handle2}`],
    ["Tried", triedsolved.handle1[0], triedsolved.handle2[0]],
    ["Solved", triedsolved.handle1[1], triedsolved.handle2[1]],
  ];

  const tried_solved_options = {
    // title: "Solved with one Submission",
    // },
    fontSize: 15,
    width: "100%",
    height: "100%",
    colors: ["rgb(14, 130, 72)", "rgb(62, 85, 168)"],
    bar: { groupWidth: "45%" },
    legend: { position: "top" },
    vAxis: {
      minValue: 0,
    }
  }
  // *********************

  // *********user-levels-barchart**********
  const user_levels_data = [
    ["Handle", `${handle.handle1}`, { role: "annotation" }, `${handle.handle2}`, { role: "annotation" }],
    ...userlevels
  ]
  const user_levels_options = {
    title: "Levels",
    // },
    fontSize: 15,
    colors: ["rgb(14, 130, 72)", "rgb(62, 85, 168)"],
    bar: { groupWidth: "100%" },
    legend: { position: 'top', alignment: 'end' },
    vAxis: {
      minValue: 0,
    },
    chartArea: { left: 100, top: 100, width: '95%', height: '55%' },
    annotations: {
      textStyle: {
        fontSize: 12,
        color: "black"
      },
      alwaysOutside: true,
      highContrast: true
    }
  }
  // ***************************************

  // ***********user-ratings-barchart**********
  const user_ratings_data = [
    ["Handle", `${handle.handle1}`, { role: "annotation" }, `${handle.handle2}`, { role: "annotation" }],
    ...userratings
  ]
  const user_ratings_options = {
    title: "Ratings",
    // },
    fontSize: 15,
    colors: ["rgb(14, 130, 72)", "rgb(62, 85, 168)"],
    bar: { groupWidth: "100%" },
    legend: { position: 'top', alignment: 'end' },
    vAxis: {
      minValue: 0,
    },
    chartArea: { left: 100, top: 100, width: '95%', height: '55%' },
    annotations: {
      textStyle: {
        fontSize: 12,
        color: "black"
      },
      alwaysOutside: true,
      highContrast: true
    }
  }
  // ******************************************

  // *****************user-tags-barchart*****************
  const user_tags_data = [
    ["Handle", `${handle.handle1}`, { role: "annotation" }, `${handle.handle2}`, { role: "annotation" }],
    ...usertags
  ]
  const user_tags_options = {
    title: "Tags",
    // },
    fontSize: 15,
    colors: ["rgb(14, 130, 72)", "rgb(62, 85, 168)"],
    bar: { groupWidth: "100%" },
    legend: { position: 'top', alignment: 'end' },
    vAxis: {
      minValue: 0,
    },
    chartArea: { left: 100, top: 90, width: '95%', height: '45%' },
    annotations: {
      textStyle: {
        fontSize: 12,
        color: "black"
      },
      alwaysOutside: true,
      highContrast: true
    }
  }
  // ****************************************************

  return (
    <div className='d-flex flex-column'>
      <div className="compare-container my-3">
        <form onSubmit={handleSubmit}>
          <div className="compare-input-container">
            <input type="text" name="handle1" value={new_handle.handle1} onChange={onchange} placeholder='Handle 1'></input>
            <input type="text" name="handle2" value={new_handle.handle2} onChange={onchange} placeholder='Handle 2'></input>
          </div>
          <div className="compare-button-container">
            <button type='submit'>Compare</button>
          </div>
        </form>
      </div>
      {user_exist === 1 ?
        <><div className=' compare-bar-container'>
          <div className='compare-bar-item my-2'>
            <Chart
              chartType="ColumnChart"
              data={unsolved_data}
              options={unsolved_options}
              width={"320px"}
              height={"300px"} />
          </div>
          <div className='compare-bar-item my-2'>
            <Chart
              chartType="ColumnChart"
              data={solved_with_one_data}
              options={solved_with_one_options}
              width={"320px"}
              height={"300px"} />
          </div>
          <div className='compare-bar-item my-2'>
            <Chart
              chartType="ColumnChart"
              data={tried_solved_data}
              options={tried_solved_options}
              width={"320px"}
              height={"300px"} />
          </div>
        </div>
          <div className="user-levels-container my-3">
            <Chart
              chartType="ColumnChart"
              data={user_levels_data}
              options={user_levels_options}
              width={"1300px"}
              height={"400px"} />
          </div>
          <div className="user-ratings-container my-3">
            <Chart
              chartType="ColumnChart"
              data={user_ratings_data}
              options={user_ratings_options}
              width={"1300px"}
              height={"500px"} />
          </div>
          <div className="user-tags-container my-3 mb-5">
            <Chart
              chartType="ColumnChart"
              data={user_tags_data}
              options={user_tags_options}
              width={"3500px"}
              height={"400px"} />
          </div></> : <></>}
    </div>
  )
}

export default Compare