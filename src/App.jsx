import React from 'react';
import './App.css';
import Dropzone from 'react-dropzone';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faCloudUploadAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faCloudUploadAlt, faTrashAlt);

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
        console.log(`POST res:\n${JSON.stringify(data)}`);
        const newFiles = data.files;
        console.log(`newFiles:\n${JSON.stringify(newFiles)}`);
        this.setState({ files: newFiles });
      });
  }

  handleDelete(fileId) {
    console.log('Handle Delete');
    console.log(`Delete file ${fileId}`);

    fetch(`http://sds.samchatfield.com/api/user/1234567/files/${fileId}`, {
      method: 'DELETE',
    })
      .then(response => response.json())
      .then((data) => {
        console.log(`DELETE res:\n${JSON.stringify(data)}`);
        const newFiles = data.files;
        console.log(`newFiles:\n${JSON.stringify(newFiles)}`);
        this.setState({ files: newFiles });
      });
  }

  render() {
    const { files } = this.state;
    return (
      <div className='App bg-dark'>
        <h1 className='Header'>SDS File Upload</h1>
        <Dropzone onDrop={this.handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className='Dropzone card bg-light' {...getRootProps()}>
                <div className='card-body'>
                  <input {...getInputProps()} />
                  <FontAwesomeIcon icon='cloud-upload-alt' size='3x' />
                  <p className='card-text'>
                    Drag and drop files here, or click to select files
                  </p>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <div className='FileList list-group'>
          {files.map(file => (
            <div className='list-group-item list-group-item-action' key={file._id}>
              <a
                // className='list-group-item list-group-item-action'
                target='_blank'
                rel='noopener noreferrer'
                href={`http://sds.samchatfield.com${file.path}`}
              >
                {file.name}
              </a>
              <FontAwesomeIcon
                icon='trash-alt'
                pull='right'
                className='icon'
                onClick={this.handleDelete.bind(this, file._id)}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default App;
