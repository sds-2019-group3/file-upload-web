import React from 'react';
import './App.css';
import Dropzone from 'react-dropzone';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faArrowAltCircleRight, faCloudUploadAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

library.add(faArrowAltCircleRight, faCloudUploadAlt, faTrashAlt);

class App extends React.Component {
  constructor(props) {
    super(props);

    const initialUserId = '1234567';

    this.state = {
      files: [],
      userId: initialUserId,
      userIdValue: initialUserId,
    };

    this.handleDrop = this.handleDrop.bind(this);
    this.handleUserChange = this.handleUserChange.bind(this);
    this.handleUserChangeSubmit = this.handleUserChangeSubmit.bind(this);
  }

  componentDidMount() {
    const { userId } = this.state;

    fetch(`/api/user/${userId}/files`)
      .then(response => response.json())
      .then(data => this.setState({ files: data }));
  }

  handleDrop(acceptedFiles) {
    const formData = new FormData();

    acceptedFiles.forEach((file) => {
      formData.append('file', file);
    });

    const { userId } = this.state;

    fetch(`/api/user/${userId}/files`, {
      method: 'POST',
      body: formData,
    })
      .then(response => response.json())
      .then((data) => {
        const newFiles = data.files;
        this.setState({ files: newFiles });
      });
  }

  handleDelete(fileId) {
    console.log('Handle Delete');
    console.log(`Delete file ${fileId}`);

    const { userId } = this.state;
    fetch(`/api/user/${userId}/files/${fileId}`, {
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

  handleUserChange(event) {
    const newUserId = event.target.value;

    this.setState({
      userIdValue: newUserId,
    });
  }

  handleUserChangeSubmit(event) {
    event.preventDefault();

    const { userIdValue } = this.state;

    if (!userIdValue) {
      this.setState({
        files: [],
        userId: userIdValue,
      });
    } else {
      fetch(`/api/user/${userIdValue}/files`)
        .then((response) => {
          if (!response.ok) {
            throw Error(response.statusText);
          }
          return response.json();
        })
        .then((data) => {
          this.setState({
            files: data,
            userId: userIdValue,
          });
        })
        .catch(() => {
          this.setState({
            files: [],
            userId: userIdValue,
          });
        });
    }
  }

  render() {
    const { files, userIdValue } = this.state;
    return (
      <div className="App bg-dark">
        <h1 className="Header">SDS File Upload</h1>
        <div className="UserSelect card bg-light">
          <form
            className="form-inline"
            onSubmit={this.handleUserChangeSubmit}
            autoComplete="off"
          >
            <label htmlFor="userField"> User ID:&nbsp;</label>
            <div className="input-group">
              <input
                id="userField"
                className="form-control"
                type="text"
                name="userId"
                value={userIdValue}
                onChange={this.handleUserChange}
              />
              <div className="input-group-append">
                <button className="btn btn-dark" type="submit">
                  <FontAwesomeIcon icon="arrow-alt-circle-right" size="lg" />
                </button>
              </div>
            </div>
          </form>
        </div>
        <Dropzone onDrop={this.handleDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div className="Dropzone card bg-light" {...getRootProps()}>
                <div className="card-body">
                  <input {...getInputProps()} />
                  <FontAwesomeIcon icon="cloud-upload-alt" size="3x" />
                  <p className="card-text">
                    Drag and drop files here, or click to select files
                  </p>
                </div>
              </div>
            </section>
          )}
        </Dropzone>
        <div className="FileList list-group">
          {files.map(file => (
            <div className="list-group-item" key={file._id}>
              <a
                // className="list-group-item list-group-item-action"
                target="_blank"
                rel="noopener noreferrer"
                href={`${file.path}`}
              >
                {file.name}
              </a>
              <FontAwesomeIcon
                icon="trash-alt"
                pull="right"
                className="icon"
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
