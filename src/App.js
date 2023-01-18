import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import { CSVLink } from "react-csv";

function App() {
  let [data1, setData1] = useState([]);
  let [firstPage, setFirstPage] = useState(null);
  let [finalPage, setFinalPage] = useState(null);
  let [arr, setarr] = useState([]);
  let initialPage = 0;
  let lastPage = 0;
  let allData = [];
  let attData = [["address", "name", "id"]];

  const numberOfPages = async () => {
    try {
      let countPages = await axios({
        method: "GET",
        url: `https://app.geckoterminal.com/api/p1/eth/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=1}&include_network_metrics=true`,
        headers: {
          "Content-Type": "application/json",
        },
      }).then(function (response) {
        return response.data.links.last.meta.series;
      });
      initialPage = countPages[0];
      lastPage = countPages[4];
    } catch (error) {
      console.log("errors", error);
    }
    setFirstPage(initialPage);
    setFinalPage(lastPage);
    endP();
  };

  const endP = async () => {
    try {
      // console.log("inside final", finalPage);
      for (let page = firstPage; page <= finalPage; page++) {
        let newArr = await axios({
          method: "GET",
          url: `https://app.geckoterminal.com/api/p1/eth/pools?include=dex,dex.network,dex.network.network_metric,tokens&page=${page}&include_network_metrics=true`,
          headers: {
            "Content-Type": "application/json",
          },
        }).then(function (response) {
          console.log("res", response.data.data);
          return response.data.data;
        });
        allData.push(...newArr);
      }
      setData1(allData);
    } catch (error) {
      console.log("err", error);
    }
  };

  const createCSV = () => {
    <h1>hello</h1>;
  };

  useEffect(() => {
    numberOfPages();
    createCSV();
  }, []);

  return (
    <div>
      <table style={{ width: "50%" }}>
        <thead>
          <th>Number</th>
          <th>Address</th>
          <th>Name</th>
          <th>relation id</th>
        </thead>
        <tbody>
          {data1.map(({ attributes, relationships }, index) => {
            // setarr(attributes);
            // attData.push(attributes);
            // console.log("222", attributes.name);
            return (
              // setarr(attData)
              attData.push([
                `${attributes.address}`,
                `${attributes.name}`,
                `${relationships.tokens.data.map(({ id }) => {
                  return `${id}`;
                })}`,
              ])

              // <tr>
              //   <td>{index + 1}</td>
              //   <td>{attributes.address}</td>
              //   <td>{attributes.name}</td>
              //   <td>
              //     {relationships.tokens.data.map(({ id }) => {
              //       return `, ${id}`;
              //     })}
              //   </td>
              // </tr>
            );
          })}
          {/* {setarr(attData)} */}
          {console.log("qqqqqq", arr)}

          {console.log("setarray", attData)}

          {/* {setarr(attData)} */}
        </tbody>
      </table>
      <CSVLink data={attData}>Export to CSV</CSVLink>
    </div>
  );
}

export default App;
