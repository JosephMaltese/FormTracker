import React from 'react';

class FileInput extends React.Component {
    constructor(props) {
        super(props);
        this.state = { fileSelected: false,
                        videoUrl: null

                    }
        // this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFileChange = this.handleFileChange.bind(this);
        this.handleDivClick = this.handleDivClick.bind(this);
        this.fileInput = React.createRef();
    }
    // handleSubmit(event) {
    //     event.preventDefault();
    //     alert(`Selected file - ${this.fileInput.current.files[0].name}`);
    // }
    handleFileChange(event) {
        if (event.target.files.length > 0) {
            const file = event.target.files[0];
            const url = URL.createObjectURL(file);
            this.setState({
                fileSelected: true,
                videoUrl: url
            });
        }
    }
    handleDivClick() {
        this.fileInput.current.click();
    }

    render() {
        return (
            // <div>
            //     <form onSubmit={this.handleSubmit}>
            //         <label>
            //             Upload file:
            //             <input type="file" 
            //                     accept=".mp4" 
            //                     ref={this.fileInput} 
            //                     onChange={this.handleFileChange}
            //             />
            //         </label>
            //         <br />
            //         <button id="submit" type="submit" disabled={!this.state.fileSelected}>Submit</button>
            //     </form>
            // </div>
            <div className='w-[80%] h-96 border-[4px] border-dotted border-black rounded-md flex justify-center items-center hover:cursor-pointer' onClick={this.handleDivClick}>
                <input 
                    type="file" 
                    accept=".mp4"
                    ref={this.fileInput}
                    onChange={this.handleFileChange}
                    className="hidden"
                />
                { this.state.fileSelected ? (
                    <video
                    src={this.state.videoUrl}
                    controls
                    className="w-full h-full object-contain"
                    />
                    ) : (
                    <div className='flex flex-col items-center'>
                        <img src="/images/fileIcon.png" alt="File Upload Icon" className='w-20 h-20'></img>
                        <h2 className='font-extrabold'>Upload a file</h2>
                        <p className='text-center w-64'>Click to browse and select a video file of 10-15 seconds in length</p>
                    </div>   
                    )
                }
                

            </div>

        )
    }
}

export default FileInput;