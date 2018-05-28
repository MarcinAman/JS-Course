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
      students: props.students,
      updateProps: props.requestPropsChange,
      toChange: [],
      view: 'summary',
      baseurl: 'http://localhost:8080/',
      random: props.rnd,
      toChangeGrade: []
    }

    this.addToChange = this.addToChange.bind(this);
    this.renderGradesToChange = this.renderGradesToChange.bind(this);
    this.handleGradeChanging = this.handleGradeChanging.bind(this);
    this.removeGrade = this.removeGrade.bind(this);
    this.addGradesToAdd = this.addGradesToAdd.bind(this);
    this.addStudentToAdd = this.addStudentToAdd.bind(this);
    this.addGradeToAdd = this.addGradeToAdd.bind(this);
    this.addSubjectToAdd = this.addSubjectToAdd.bind(this);
    this.updateGradeOnClick = this.updateGradeOnClick.bind(this);
    this.updateData = this.updateData.bind(this);
  }

  mapGrades(student){
    return student.grades.map(
        (e) =>(<td>{e.subject} {e.grade}</td>)
    )
  }

  addToChange(element){
    if(this.state.toChange.includes(element)){
      this.setState((prevState)=>({
          toChange: prevState.toChange.filter((e)=>e!==element)
      }))
    }
    else{
        this.setState((prevState)=>{
            prevState.toChange.push(element)
            return {toChange: prevState.toChange}
        })
    }
  }

  removeStudentFromToChange(student_id){
      this.setState((prevState) => ({
          toChange: prevState.toChange.filter((e)=>e.student_id!==student_id)
      }))

      if(this.state.toChange.length === 0){
          this.setState({view: 'summary'})
      }
  }

  changeGrade(student_id,subject,newMark,oldMark){
      fetch(
          this.state.baseurl+'update/update/id:'+student_id+'/'+subject+'/'+oldMark+'/'+newMark
      )
          .then(
              () => this.removeStudentFromToChange(student_id)
          )
          .catch(
              (e) => console.log(e)
          )
  }

  removeGrade(student_id,subject,grade){
      fetch(
          this.state.baseurl+'update/remove/id:'+student_id+'/'+subject+'/'+grade
      ).then(
          () => this.removeStudentFromToChange(student_id)
      )
  }

  handleGradeChanging(a,el,subject,grade){

      const newValue = a.target.value

      const list = this.state.toChangeGrade

      let isChanged = false

      list.map(
          (element) => {
            if(element.student_id === el.student_id &&
            element.subject === subject){
                element.newValue = newValue;
                isChanged = true
            }
            return element;
          }
      )

      if(!isChanged){
          list.push({student_id: el.student_id,subject: subject,newValue:newValue,oldValue:grade})
      }

      this.setState({toChangeGrade: list})
  }

  updateGradeOnClick(){
      console.log(this.state.toChangeGrade)
      this.state.toChangeGrade.forEach(
          (e) => {
              this.changeGrade(e.student_id,e.subject,e.newValue,e.oldValue);
          }
      )

      this.setState({toChangeGrade: []});
  }

  renderGradesToChange(e){
    this.setState({view:'change'})
  }

  mapStudentsSummary(){
    return this.state.students.map(
        (e)=> (<tr><td><input type="checkbox" onChange={(a)=>this.addToChange(e)}/></td>
            <td>{e.name}</td><td>{e.student_id}</td>{this.mapGrades(e)}</tr>)
    )
  }

  mapHeadersSummary(){
      return (<thead><th>Change</th><th>Name</th><th>Student's id:</th></thead>)
  }

  mapStudentsToOptions(){
      return this.state.students.map(
          (e) => <option value={e.student_id}>{e.name}</option>
      )
  }

  componentWillReceiveProps(){
      this.setState((prev)=>({random:!prev.random}))
  }

  updateData(){
      return fetch(
          this.state.baseurl+'getTeacher'
      )
          .then(
              (el) => el.json()
          )
          .then(
              (a) => this.setState({students: a.students})
          )
  }

  componentDidMount(){
      return this.updateData()
  }

  addGradesToAdd(){
      fetch(
          this.state.baseurl+'update/add/id:'+this.state.currentStudent+'/'+
          this.state.currentSubject+'/'+this.state.currentGrade
      )
          .then(
              () => {
                  alert("Grade added!");
                  this.state.updateProps()
                  this.setState({view:'summary'});
              }
          )
  }

  addStudentToAdd(student_name){
      this.setState({currentStudent:student_name.target.value})
  }

  addGradeToAdd(grade){
      this.setState({currentGrade:grade.target.value})
  }

  addSubjectToAdd(subject){
      this.setState({currentSubject:subject.target.value})
  }

  render(){
    if(this.state.view === 'summary'){
        return(<div><table width="100%">
            {this.mapHeadersSummary()}
            {this.mapStudentsSummary()}
        </table>
            <input type="button" onClick={this.renderGradesToChange} value="Modify"/>
            <input type="button" onClick={() => this.updateData()} value="Refresh"/>
        </div>)
    }
    else{
      return(<div>
        <table width="100%">
            {<thead>Name</thead>}
            {this.state.toChange.map(
                (e) => (<tr>{e.grades.map(
                    (a) => <td>{a.subject}:<input defaultValue={a.grade}
                                                  onChange={(x) => this.handleGradeChanging(x,e,a.subject,a.grade)}/>
                    <input type="button" onClick={(event) => this.removeGrade(e.student_id,a.subject,a.grade)} value="RM"/></td>
                    )}</tr>)
            )}
        </table>
          <input type="button" onClick={this.updateGradeOnClick} value="Update"/>
          <div>
                      Pick a student to add a grade:
                      <select defaultValue={0} onChange={this.addStudentToAdd}>
                          {this.mapStudentsToOptions()}
                      </select>
                      <input type="text" onChange={this.addSubjectToAdd}/>
                      <input type="number" onChange={this.addGradeToAdd} defaultValue="2"/>
              <input type="button" onClick={this.addGradesToAdd} value="Add"/>
          </div>
      </div>
      )
    }
  }

}

class App extends Component {
  constructor(){
    super();
    this.state = {baseURL: 'http://localhost:8080/',isLoaded:false,view:'log-in',rnd:false};
    this.getData();

    this.changeText = this.changeText.bind(this);
    this.changeViewOnClick = this.changeViewOnClick.bind(this);
    this.getNewProps = this.getNewProps.bind(this);
  }

  getData(optionalURL){
      let currentURL = ''
      if(optionalURL){
         currentURL = optionalURL
      }
    return fetch(this.state.baseURL+currentURL).then(
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

  getNewProps(){
     this.getData('getTeacher');
     this.setState((prev)=>({rnd:!prev.rnd}))
  }

  changeViewOnClick(mode){
    this.setState({view:mode})
  }

  changeText(e){
    this.setState({student_id:e.target.value})
  }

  componentDidMount(){
    this.getData('getTeacher')
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
        <Teacher students={this.state.students} name={this.state.name} position={this.state.position}
                 requestPropsChange={this.getNewProps} rnd={this.state.rnd}/>
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
