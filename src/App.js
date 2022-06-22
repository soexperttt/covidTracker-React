import "./App.css";
import { useState } from "react";
import { useEffect } from "react";
import Select from "react-select";

function App() {
  const [countryName, setCountryName] = useState("");
  const [searchedCountry, setSearchedCountry] = useState("Global");
  const [confirmedCount, setConfirmedCount] = useState(0);
  const [deathCount, setDeathCount] = useState(0);
  const [lastUpdate, setLastUpdate] = useState("");
  const [imge, setImge] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(true);
  const [option, setOption] = useState([]);

  useEffect(() => {
    const getDataFromApi = async () => {
      const request = await fetch("https://covid19.mathdro.id/api");
      const data = await request.json();
      setConfirmedCount(data.confirmed.value);
      setDeathCount(data.deaths.value);
      setLastUpdate(data.lastUpdate);
      setImge(data.image);
      setSource(data.source);
      setLoading(false);
    };
    getDataFromApi();
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      const request = await fetch("https://covid19.mathdro.id/api/countries");
      const data = await request.json();
      const optionMap = data.countries.map((data) => {
        return {
          value: data.iso2,
          label: data.name,
        };
      });
      console.log(optionMap);
      setOption(optionMap);
    };
    getCountries();
  }, []);

  const getDataFromApi = async (country) => {
    setLoading(true);
    const request = await fetch(
      "https://covid19.mathdro.id/api/countries/" + country.value
    );
    const data = await request.json();
    setLoading(false);

    if (request.status !== 200) {
      alert("data.error.message");

      return;
    }
    setConfirmedCount(data.confirmed.value);
    setDeathCount(data.deaths.value);
    setLastUpdate(data.lastUpdate);
    setSearchedCountry(country.label);
    setCountryName("Global");
  };

  return (
    <div className="container">
      {loading ? (
        <div
          style={{ width: "100px", height: "100px" }}
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      ) : (
        <>
          <h1 className="text-center">covid-19 tracker</h1>
          <div className="input-group p-3 mt-3">
            <Select
              onChange={(data) => getDataFromApi(data)}
              className="form-control"
              options={option}
            />
          </div>
          <p>
            The total number of covid-19 cases for{" "}
            <span>{searchedCountry}</span> as follow:
          </p>
          <div className="data">
            <div>
              <p>Confirmed count</p>
              <p>{confirmedCount}</p>
            </div>
            <div>
              <p>Death count</p>
              <p>{deathCount}</p>
            </div>
          </div>
          <p>Last update: {lastUpdate}</p>
          <p>
            <a href={source} target="_blank">
              Source
            </a>
          </p>
          <div className="picFrame">
            <img src={imge} alt="covid-19"></img>
          </div>{" "}
        </>
      )}
    </div>
  );
}

export default App;
