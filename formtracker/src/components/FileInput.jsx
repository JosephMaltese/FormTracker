import React from 'react';

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { fileSelected: false }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.fileInput = React.createRef();
    }
    handleSubmit(event) {
        event.preventDefault();
        alert(`Selected file - ${this.fileInput.current.files[0].name}`);
    }
    handleFileChange(event) {
        this.setState({ fileSelected: event.target.files.length > 0 });
    }

    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>
                        Upload file:
                        <input type="file" 
                                accept=".mp4" 
                                ref={this.fileInput} 
                                onChange={this.handleFileChange}
                        />
                    </label>
                    <br />
                    <button id="submit" type="submit" disabled={!this.state.fileSelected}>Submit</button>
                </form>
            </div>

        )
    }
}

export default FileInput;