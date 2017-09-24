import React from 'react';

export default class AddSection extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
        this.handleInput = this.handleInput.bind(this);
        this.toggleShowDialog = this.toggleShowDialog.bind(this);
        this.submit = this.submit.bind(this);
    }
    toggleShowDialog() {
        this.setState({
            showDialog: !this.state.showDialog
        });
    }
    handleInput(e) {
        this.setState({
            [e.target.name]: e.target.value
        }, () => {
            console.log('Add Section: handleInput state:', this.state);
        });
    }
    submit() {
        this.toggleShowDialog();
    }
    render() {
        const { courseId } = this.props;
        return (
            <div>
                {this.state.showDialog || <button onClick={this.toggleShowDialog}>Add New Section</button>}
                {this.state.showDialog &&
                <div>
                    <input type="text" name="sectionName" placeholder="Section Name" onChange={this.handleInput}/>
                    <input type="text" name="startDate" placeholder="Start Date (optional)"/>
                    <input type="text" name="endDate" placeholder="End Date (optional)" />
                    <button onClick={this.submit}>Save New Course</button>
                </div>

                }

            </div>
        )
    }
}
