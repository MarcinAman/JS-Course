import React, { Component } from 'react';
import './App.css';

class GradeIndividual extends Component{
  constructor(props){
    super(props);
    this.state = props.state;
  }

  render(){
    return(
        <div>
            <h4>{this.state.subject}</h4>
            <div>{this.state.grade}</div>
        </div>
    )
  }
}

class GradeFromTeacher extends Component{
  constructor(props){
    super(props);
    this.state = props.state;
    this.state.changeGrade = props.changeGrade
  }

  render(){
    return(
        <div>
            <div>{this.state.subject} {this.state.grade}</div>
        </div>
    )
  }
}

class StudentFromTeacher extends Component{
  constructor(props){
    super(props);
    this.state = props.state;

    this.changeGrade = this.changeGrade.bind(this)
  }

  changeGrade(event,subject,value){

  }

  mapGradesToObjects(){
    return this.state.grades.map(
        (grade) => <GradeFromTeacher state={grade} changeGrade={this.changeGrade}/>
    )
  }

  render(){
    return(<div>{this.mapGradesToObjects()}</div>)
  }
}

class StudentIndividual extends Component{
  constructor(props){
    super(props);
    this.state = props.state
  }

  mapGradesToObjects(){
    return this.state.grades.map(
        (grade) => <GradeIndividual state={grade}/>
    )
  }

  render(){
    return(<div>
      <h1>{this.state.name}</h1>
      <h3>{this.state.student_id}</h3>
      <div>{this.mapGradesToObjects()}</div>
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
        (element) => element.json()
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
    if(this.state.view == 'teacher'){
      return(<div>
        <Teacher students={this.state.students} name={this.state.name} position={this.state.position}/>
      </div>)
    }
    else{
      return(<div>
        <StudentIndividual state={this.getStudentObjectById(this.state.student_id)}/>
      </div>)
    }
  }
}

export default App;
