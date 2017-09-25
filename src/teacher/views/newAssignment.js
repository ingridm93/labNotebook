import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { getAllSections, saveNewAssignment } from '../actions';


class TeacherNewAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            include: {
                title: false,
                question: false,
                abstract: false,
                hypothesis: false,
                variables: false,
                materials: false,
                procedures: false,
                data: false,
                calculations: false,
                discussion:false
            },
            editable: {},
            shared: {},
            defaults: {
                defaults_title: "",
                defaults_question: "",
                defaults_abstract: "",
                defaults_hypothesis: "",
                defaults_variables: "",
                defaults_materials: "",
                defaults_procecures: "",
                defaults_data: "",
                defaults_calculations: "",
                defaults_discussion: "",
            }
        };
        this.handleInput = this.handleInput.bind(this);
        this.submit = this.submit.bind(this);
        this.handleSectionInput = this.handleSectionInput.bind(this);
        this.handleIncludeInput = this.handleIncludeInput.bind(this);
        this.handleDefaults = this.handleDefaults.bind(this);
        this.handleEditable = this.handleEditable.bind(this);
        this.handleShared = this.handleShared.bind(this);
    }
    componentDidMount() {

        this.props.dispatch(getAllSections());

    }
    handleSectionInput(event){
        var name = event.target.name;
        var sections = [...this.state.sections, name.substring(9,name.length)];
        this.setState({
            sections
        }, () => {
            console.log(this.state);
        });
    }
    handleIncludeInput(event){

        const target = event.target;
        const value = target.checked;
        const name = target.name;

        var include = Object.assign({}, this.state.include, {
            [name]: value
        });
        this.setState({include}, () => {
            console.log(this.state);
        });
    }
    handleInput(event) {
        const target = event.target;
        if(target.type == 'checkbox') {
            console.log(target.checked)
        }
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
          [name]: value
        }, () => {
            console.log('New Assignment: handleInput state:', this.state);
        });
    }
    handleDefaults() {
        const value = event.target.value;
        const name = event.target.name;

        var defaults = Object.assign({}, this.state.defaults, {
            [name]: value
        });
        this.setState({defaults}, () => {
            console.log(this.state);
        });
    }
    handleEditable() {
        const target = event.target;
        const value = target.checked;
        const name = target.name.substring(0, target.name.length-8);

        var editable = Object.assign({}, this.state.editable, {
            [name]: value
        });
        this.setState({editable}, () => {
            console.log(this.state);
        });
    }
    handleShared() {
        const target = event.target;
        const value = target.checked;
        const name = target.name.substring(0, target.name.length-5);

        var shared = Object.assign({}, this.state.shared, {
            [name]: value
        });
        this.setState({shared}, () => {
            console.log(this.state);
        });
    }
    submit() {
        if(this.checkSections()) {
            console.log('dispatching');
            this.props.dispatch(saveNewAssignment(this.state));
        } else {
            this.setState({
                sectionError: "Please select a class"
            });
        }

        //validation!
        //console.log(this.state);
        //browserHistory.push('/teacher/assignments');
    }
    checkSections() {
        console.log(console.log(this.state.sections.length));
        if(this.state.sections.length > 0) {
            return true;
        }
        return false;
    }
    render() {
        const { sections } = this.props;

        var events = {
            include: this.handleIncludeInput,
            defaults: this.handleDefaults,
            editable: this.handleEditable,
            shared: this.handleShared
        }

        var assignmentOptions =
                <div >
                    <div style={assignmentGridStyle}>
                        <p>Include</p>
                        <p>Category</p>
                        <p>Default values</p>
                        <p>Students can edit?</p>
                        <p>Shared amongst groups?</p>
                    </div>
                    {createAssignmentCategoryDiv('Title', events) }
                    {createAssignmentCategoryDiv('Question', events)}
                    {createAssignmentCategoryDiv('Abstract', events)}
                    {createAssignmentCategoryDiv('Hypothesis', events)}
                    {createAssignmentCategoryDiv('Variables', events)}
                    {createAssignmentCategoryDiv('Materials', events)}
                    {createAssignmentCategoryDiv('Procedures', events)}
                    {createAssignmentCategoryDiv('Data', events)}
                    {createAssignmentCategoryDiv('Calculations', events)}
                    {createAssignmentCategoryDiv('Discussion', events)}
                </div>;
        if(!sections) {
            return null;
        }else {
            return (
                <div>
                    <div>Sections list</div>
                    {this.state.sectionError && <p>{this.state.sectionError}</p>}
                    {makeSectionList(sections, this.handleSectionInput)}
                    <label forHtml="assignmentName">Assignment Name</label>
                    <input type="text" name="assignmentName" onChange={this.handleInput} />
                    <label forHtml="due">Due Date (optional)</label>
                    <input type="text" name="due" onChange={this.handleInput} />
                    <label forHtml="instructions">Instructions (optional)</label>
                    <input type="textarea" rows="4" name="instructions" onChange={this.handleInput} />
                    <label forHtml="group_lab">Group Lab?</label>
                    <input type="checkbox" name="group_lab" onChange={this.handleInput}/>

                    <h3>Assignment Details</h3>
                    {assignmentOptions}
                    <button onClick={this.submit}>Save assignment</button>
                </div>

            );
        }
    }
}

/********* CONNECTED COMPONENT ********/
const mapStateToProps = function(state) {
    return {
        error: state.teachers.error,
        sections: state.teachers.sections
    };
}
export default connect(mapStateToProps)(TeacherNewAssignment);

function createAssignmentCategoryDiv(category, events) {
    return (
        <div style={assignmentGridStyle}>
            <input type="checkbox" name={`${category.toLowerCase()}`} onChange={events.include}/>
            <label forHtml={`${category}`}>{`${category}`}</label>
            <input type="text" name={`default_${category.toLowerCase()}`} placeholder="Type default text here that will appear on all student assignments"  onChange={events.defaults} style={inputStyle}/>
            <input type="checkbox" name={`${category.toLowerCase()}Editable`} onChange={events.editable}/>
            <input type="checkbox" name={`${category.toLowerCase()}Share`} onChange={events.shared} />
        </div>
    )
}

function makeSectionList(items, save) {
    var itemList = items.map(item => {
        console.log(item);
        return (
            <li key={item.id.toString()}>
                <input type="checkbox" name={`sectioncb${item.id}`} onChange={save}/>{item.name}
            </li>
        );
    });
    return (
        <ul>
            {itemList}
        </ul>
    );
}

/************** STYLES ****************/
var assignmentGridStyle = {
    display: "grid",
    gridTemplateColumns: '100px 100px auto 100px 100px'
}

var inputStyle = {
    width: '400px'
}
