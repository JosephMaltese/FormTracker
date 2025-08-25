import React, { ChangeEvent } from 'react';

interface FileInputProps {
    onFileSelect: (file: File) => void;
}

interface FileInputState {
    fileSelected: boolean;
    videoUrl: string | null;
  }

class FileInput extends React.Component<FileInputProps, FileInputState> {
    private fileInput: React.RefObject<HTMLInputElement | null>;
    constructor(props: FileInputProps) {
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
    handleFileChange(event: ChangeEvent<HTMLInputElement>) {
        if (event.target.files) {
            if (event.target.files.length > 0) {
                const file = event.target.files[0];
                const url = URL.createObjectURL(file);
                this.setState({
                    fileSelected: true,
                    videoUrl: url
                });
                this.props.onFileSelect(file);
            }
        }
    }
    handleDivClick() {
        if (this.fileInput.current) {
            this.fileInput.current.click();
        }
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
            <div className='w-[80%] h-96 border-[4px] border-dotted border-black dark:border-white rounded-md flex justify-center items-center hover:cursor-pointer dark:bg-gray-700' onClick={this.handleDivClick}>
                <input 
                    type="file" 
                    accept=".mp4"
                    ref={this.fileInput}
                    onChange={this.handleFileChange}
                    className="hidden"
                />
                { this.state.fileSelected ? (
                    <video
                    src={this.state.videoUrl ? this.state.videoUrl : ''}
                    controls
                    className="w-full h-full object-contain"
                    />
                    ) : (
                    <div className='flex flex-col items-center'>
                        <img src="/images/fileIcon.png" alt="File Upload Icon" className='w-20 h-20'></img>
                        <h2 className='font-extrabold mt-3'>Upload a file</h2>
                        <p className='text-center w-64'>Click to browse and select a video file of 10-15 seconds in length</p>
                    </div>   
                    )
                }
                

            </div>

        )
    }
}

export default FileInput;