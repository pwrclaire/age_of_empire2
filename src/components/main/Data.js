import React, { Component } from 'react';
import Select from 'react-select';

class Data extends Component {
  state = {
    data: [],
    tech: null,
    unit: null,
    kingdom: '',
    createdIn: null
  }

  componentDidUpdate() {
    this.mapData();
  }

  componentDidMount() {
    fetch('http://localhost:8080/api/v1/civilizations')
    .then(res => res.json())
    .then(data => {
      this.setState({
        data
      })
    })
  }

  fetchEverything = async (type, url) => {
    try {
      if(url.length > 1) {
        console.log("2 urls", url);
        let set = [];
        Promise.all([
          url.forEach(u => {
            fetch(u).then((res) => res.json()).then(d => {
              set.push(d);
              this.setState({
                [type] : set
              })
              console.log(this.state[type]);
            })
          })
        ])
      } else {
        console.log("one url", url);
        const res = await fetch(url);
        const data = await res.json();
        // the below doesn't run until the above has completed
        //because we are waiting on the await.
        console.log("Fetch everything data", data);
        this.setState({
          [type]: data
        })
      }
      console.log(this.state);
    }
    catch (error) {
      console.log(error);
    }
  }

  selectKingdom = async civilization => {
    const url = `http://localhost:8080/api/v1/civilization/${civilization}`;
    const res = await fetch(url);
    const data = await res.json();
    return this.setState({ kingdom: data });
  }

  mapData = () => {
    const c = this.state.kingdom;
    if (c) {
      return (
        <div className="row">
        <div className="col s12 m7 6">
        <div className="card" key={c.id}>
          <div className="card-image waves-effect waves-block waves-light">
            <img className="activator" src={require('../../image/aztecs.png')} alt='z'></img>
          </div>

          <div className="card-content">
            <span className="card-title activator grey-text text-darken-4">{c.name}<i className="material-icons right">...</i></span>
            <p>Team Bonus: {c.team_bonus}</p>
          </div>

          <div className="card-reveal">
          <span className="card-title grey-text text-darken-4">{c.name}<i className="material-icons right">x</i></span>
            <h6>Civilization Bonus:</h6>
            {c.civilization_bonus.map((x, index) => {
              return (
                <li key={index} style={style.list}>{x}</li>
                )}
              )}
              <br></br>
              <button onClick={() => this.fetchEverything('tech', c.unique_tech)} className='btn'>Fetch Tech</button>
              <br></br>
              <span>{this.state.tech ?
                this.state.tech.length > 1 ? 
                this.state.tech.map(x => {
                  return (
                    <li key={x.id}>{x.name}</li>
                  )
                }) :
                `${this.state.tech.name} - ${this.state.tech.description}` :
                'No Tech'}
                </span>
                <br></br>
                <br></br>
              <button onClick={() => this.fetchEverything('unit', c.unique_unit)} className='btn'>Fetch Unit</button>
              <br></br>
              <span>{this.state.unit ?
                this.state.unit.length > 1 ?
                this.state.unit.map(x => {
                  return (
                    <li key={x.id}>{x.name} - {x.description}</li>
                  )
                }) :
                `${this.state.unit.name} - ${this.state.unit.description}` :
                'No Unit'}
                </span>
            </div>
          </div>
        </div>
      </div>
    )}
  }

  setKingdom = (civilization) => {
    console.log('SetKingdom', civilization);
    this.setState({
      kingdom: civilization,
      tech: null,
      unit: null
    })
  }

  displayTechInfo = () => {
    const { tech } = this.state;
    if(tech) {
      return (
        <div>Tech Field {tech.expansion}</div>
      )
    }
  }

  displayUnitInfo = () => {
    console.log("how often do i run");
    const { unit, createdIn } = this.state;
    if(unit) {
      const createUrl = unit.created_in;
      console.log("URL", [createUrl]);
      this.fetchEverything("createdIn", [createUrl]);
        return (
         <div>Unit Field {unit.hit_points}}</div>
        )
    }
  }

  render() {
   return (
     <div>
       <div style={{'paddingBottom': '200px'}}>
         <h4>Select Your Kingdom</h4>
         <Select
          options={this.state.data.civilizations}
          onChange={this.setKingdom}
          getOptionLabel ={(option)=>option.name}
          getOptionValue ={(option)=>option.id}
        />
       </div>
       <div>{this.mapData()}</div>
       <div>{this.displayTechInfo()}</div>
       <div>{this.displayUnitInfo()}</div>
     </div>
   )
  }
}

const style = {
  list: {
    listStyleType: 'none'
  }
}

export default Data;