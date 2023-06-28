import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
// @mui
import {
  Card,
  Stack,
  Button,
  Container,
  Typography,
  OutlinedInput,
  TextField,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Box
} from '@mui/material';
import axios from 'axios';
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useParams } from 'react-router-dom';

export default function UpdateHotel() {
  const [hotelName, setHotelName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [file, setFile] = useState("");
  const [info, setInfo] = useState([]);

  const param = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`/hotels/${param.id}`);
        console.log(res.data[0]);
        setInfo(res.data[0]);
      } catch (err) {
        console.log(err)
      }
    };

    fetchData();

  }, param.id);

  const handleClick = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "upload_file");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/desuzwkpg/image/upload",
        data
      );

      const { url } = uploadRes.data;

      await axios.patch(`/hotels/${param.id}`, {
        HotelName: hotelName,
        Phone: phone,
        img: url,
        Address: address
      });
      window.location.replace('/dashboard/hotel/');
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    console.log(file);
  })

  return (
    <>
      <Helmet>
        <title> Update Hotel </title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Update Hotel
          </Typography>
        </Stack>
        <Card>
          <CardContent>
            <form onSubmit={e => e.preventDefault()}>
              <Grid container spacing={5}>
                <Grid item xs={12}>
                  <Box>
                    <img
                      style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover' }}
                      src={
                        file
                          ? URL.createObjectURL(file)
                          : (info.img ? info.img : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg")
                      }
                      alt=""
                    />
                    <div style={{ display: 'flex', position: 'relative', alignItems: 'center', marginTop: '30px' }}>
                      <InputLabel htmlFor="file" style={{ display: 'flex', alignItems: 'center' }} >
                        Image: <DriveFolderUploadIcon style={{ marginLeft: '20px', cursor: 'pointer' }} htmlFor="file" />
                      </InputLabel>
                      <input
                        // multiple
                        type="file"
                        id="file"
                        onChange={(e) => setFile(e.target.files[0])}
                        style={{ display: "none" }}
                      />
                    </div>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='HotelName' placeholder='Vin' onChange={(e) => setHotelName(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField fullWidth label='Address' placeholder='Ha Noi' onChange={(e) => setAddress(e.target.value)} />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    type='phone'
                    label='Phone'
                    placeholder='1234567890'
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{
                      gap: 5,
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Button type='submit' variant='contained' size='large' onClick={handleClick}>
                      Update Hotel
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
