import React, { Component } from 'react';
import './App.css';

class StudentIndividual extends Component{
  constructor(props){
    super(props);
    this.state = props.state[0];
  }

  getGradesSummary(){
    return this.state.grades.reduce(
        (prev,current) => {
          if(prev[current.subject]){
              prev[current.subject].push(current.grade)
          }
          else{
            prev[current.subject] = [current.grade]
          }

          return prev
        },{}
    )
  }

  mapGrades(grades){
    return Object.keys(grades).map(
        (current) => {
          return(
              <tr><td>{current}:</td>
                  {grades[current].map(
                      (e)=> <td>{e}</td>
                  )}
              </tr>
          )
        })
  }

  render(){
    return(<div>
      <h1>{this.state.name}</h1>
      <h3>Student id:{this.state.student_id}</h3>
      <table width="50%">{this.mapGrades(this.getGradesSummary())}</table>
    </div>)
  }
}

class Teacher extends Component{
  constructor(props){
    super();
    this.state = {
      name: props.name,
      position: props.position,
      students: props.students
    }
  }

  mapGrades(student){
    return student.grades.map(
        (e) =>(<td>{e.subject} {e.grade}</td>)
    )
  }

  mapStudents(){
    return this.state.students.map(
        (e)=> (<tr><td>{e.name}</td><td>{e.student_id}</td>{this.mapGrades(e)}</tr>)
    )
  }

  mapHeaders(){
      return (<thead><th>Name</th><th>Student's id:</th></thead>)
  }


  render(){
    return(<table width="100%">
        {this.mapHeaders()}
        {this.mapStudents()}
        </table>)
  }

}

class App extends Component {
  constructor(){
    super();
    this.state = {baseURL: 'http://localhost:8080/',isLoaded:false,view:'log-in'};
    this.getData();

    this.changeText = this.changeText.bind(this);
    this.changeViewOnClick = this.changeViewOnClick.bind(this)
  }

  getData(){
    return fetch(this.state.baseURL).then(
        (element) => {
          return element.json()
        }
    ).then(
        (parsed) => {
          this.setState(parsed)
          this.setState({isLoaded: true})
        }
    ).catch(
        (err) => console.log(err)

    )
  }

  changeViewOnClick(mode){
    this.setState({view:mode})
  }

  changeText(e){
    this.setState({student_id:e.target.value})
  }

  componentDidMount(){
    this.getData()
  }

  getStudentObjectById(id){
    return this.state.students.filter(
        (student) => {
          return student.student_id === id;
        }
    )
  }

  render(){
    if(this.state.view === 'log-in'){
      return(<div className="log-in">
        <input type="button" onClick={(e) => this.changeViewOnClick('teacher')} value="Teacher"/>
        <input type="button" onClick={(e) => this.changeViewOnClick('student')} value="Student"/>
        <input type="textarea" onChange={this.changeText} placeholder="ID"/>
      </div>)
    }
    if(!this.state.isLoaded){
        return(<div className="modal">
          loading
        </div>)
    }
    if(this.state.view === 'teacher'){
      return(<div>
        <Teacher students={this.state.students} name={this.state.name} position={this.state.position}/>
      </div>)
    }
    else{
      return(<div>
        <StudentIndividual state={this.getStudentObjectById(parseInt(this.state.student_id,10))}/>
      </div>)
    }
  }
}

export default App;
