import React, { useState } from 'react';
import { Button, Input, Table, Icon } from 'semantic-ui-react';
import { saveAs } from 'file-saver';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const FileHandlerComponent = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await axios.post('http://localhost:8080/file/post', formData);
      updateFileList();
      toast.success('File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Error uploading file');
    }
  };

  const handleFileDownload = async (fileName) => {
    try {
      const response = await axios.get(`http://localhost:8080/file/get/${fileName}`, {
        responseType: 'blob',
      });

      saveAs(response.data, fileName);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Error downloading file:', error);
      toast.error('Error downloading file');
    }
  };

  const handleFileDelete = async (fileName) => {
    try {
      await axios.delete(`http://localhost:8080/file/delete/${fileName}`);
      updateFileList();
      toast.success('File deleted successfully');
    } catch (error) {
      console.error('Error deleting file:', error);
      toast.error('Error deleting file');
    }
  };

  const updateFileList = async () => {
    try {
      const response = await axios.get('http://localhost:8080/file/list');
      setFileList(response.data);
    } catch (error) {
      console.error('Error fetching file list:', error);
    }
  };

  React.useEffect(() => {
    updateFileList();
  }, []);

  return (
    <div className="ui container center aligned">
      <h1 className="ui header center aligned">File handler Application</h1>
      <Input type="file" onChange={handleFileChange} />
      <Button color="teal" onClick={handleFileUpload}>
        Upload
      </Button>

      <h2 className='ui large header'>List of uploaded files</h2>

      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>File Name</Table.HeaderCell>
            <Table.HeaderCell>Action</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {fileList.map((fileName) => (
            <Table.Row key={fileName}>
              <Table.Cell>{fileName}</Table.Cell>
              <Table.Cell>
                <Button icon color="blue" onClick={() => handleFileDownload(fileName)}>
                  <Icon name="download" />
                </Button>
                <Button icon color="red" onClick={() => handleFileDelete(fileName)}>
                  <Icon name="trash" />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default FileHandlerComponent;


