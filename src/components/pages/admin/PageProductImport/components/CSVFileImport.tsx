import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Typography from "@material-ui/core/Typography";
import axios from 'axios';
import { getType } from 'mime';

const useStyles = makeStyles((theme) => ({
  content: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(3, 0, 3),
  },
}));

type CSVFileImportProps = {
  url: string,
  title: string
};

export default function CSVFileImport({url, title}: CSVFileImportProps) {
  const classes = useStyles();
  const [file, setFile] = useState<any>();

  const onFileChange = (e: any) => {
    console.log(e);
    let files = e.target.files || e.dataTransfer.files
    if (!files.length) return
    setFile(files.item(0));
  };

  const removeFile = () => {
    setFile('');
  };

  const uploadFile = async (e: any) => {
      // Get the presigned URL
      const authToken = localStorage.getItem('authorization_token');
      const headers = authToken && { Authorization: `Basic ${authToken}` }
      const response = await axios({
        method: 'GET',
        url,
        params: {
          name: encodeURIComponent(file.name)
        },
        headers
      });
      console.log('File to upload: ', file.name);
      console.log('Uploading to: ', response.data);
      const contentType: string = getType(file.name) as string;
      console.log(contentType, 'CONTENT TYPE');
      const result = await fetch(response.data, {
        method: 'PUT',
        body: file,
        headers: {
            'Content-Type': contentType
        }
      })
      console.log('Result: ', result)
      setFile('');
    }
  ;

  return (
    <div className={classes.content}>
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      {!file ? (
          <input type="file" onChange={onFileChange}/>
      ) : (
        <div>
          <button onClick={removeFile}>Remove file</button>
          <button onClick={uploadFile}>Upload file</button>
        </div>
      )}
    </div>
  );
}
