import React from 'react';
// import logo from './logo.svg';
import './App.css';
// import Dropzone from './Dropzone';
// import FileList from './FileList';
import Dropzone from 'react-dropzone';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      files: [],
    };

    this.handleDrop = this.handleDrop.bind(this);
  }

  componentDidMount() {
    fetch('http://sds.samchatfield.com/api/user/1234567/files')
      .then(response => response.json())
      .then(data => this.setState({ files: data }));
  }

  handleDrop(acceptedFiles) {
    console.log('Handle Drop');
    console.log(acceptedFiles);
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append('file', file);
    });

    fetch('http://sds.samchatfield.com/api/user/1234567/files', {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data) => {
        console.log(`res:\n${JSON.stringify(data)}`);
        const newFiles = data.files;
        console.log(`newFiles:\n${JSON.stringify(newFiles)}`);
        this.setState({ files: newFiles });
      });
  }

  render() {
    const { files } = this.state;
    return (
      <div className="App">
        {/* <header className="App-header"> */}
        <h1>SDS File Upload</h1>
        <Dropzone onDrop={this.handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="Dropzone" {...getRootProps()}>
                <input {...getInputProps()} />
                <p>Drag and drop some files here, or click to select files</p>
              </div>
            </section>
          )}
        </Dropzone>
        <div>
          <ul>
            {files.map(file => (
              <li key={file.name}>
                <a target="_blank" rel="noopener noreferrer" href={`http://sds.samchatfield.com${file.path}`}>{file.name}</a>
              </li>
            ))}
          </ul>
        </div>
        {/* </header> */}
      </div>
    );
  }
}

export default App;
