import React, { ChangeEvent } from 'react';
import { Upload, FileVideo } from 'lucide-react';

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
            <div 
                className='w-full h-full border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex justify-center items-center hover:cursor-pointer dark:bg-gray-800/50 hover:border-blue-400 dark:hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group' 
                onClick={this.handleDivClick}
            >
                <input 
                    type="file" 
                    accept=".mp4"
                    ref={this.fileInput}
                    onChange={this.handleFileChange}
                    className="hidden"
                />
                { this.state.fileSelected ? (
                    <div className='w-full h-full p-2'>
                        <video
                        src={this.state.videoUrl ? this.state.videoUrl : ''}
                        controls
                        className="w-full h-full object-contain rounded-lg shadow-lg"
                        />
                    </div>
                    ) : (
                    <div className='flex flex-col items-center p-4 text-center'>
                        <div className='p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-3 group-hover:bg-blue-200 dark:group-hover:bg-blue-900/50 transition-colors duration-300'>
                            <Upload className='h-8 w-8 text-blue-600 dark:text-blue-400' />
                        </div>
                        <h2 className='font-bold text-lg mb-2 text-gray-800 dark:text-gray-200'>
                            Upload Video File
                        </h2>
                        <p className='text-gray-600 dark:text-gray-400 text-sm max-w-48 leading-relaxed'>
                            Click to browse and select a video file of 10-15 seconds in length
                        </p>
                        <div className='mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400'>
                            <FileVideo className='w-3 h-3' />
                            <span>Supports MP4 format</span>
                        </div>
                    </div>   
                    )
                }
                

            </div>

        )
    }
}

export default FileInput;