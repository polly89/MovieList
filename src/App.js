import { useState, useEffect } from 'react';
import Auth from './components/auth.js';
import { db, auth, storage } from './config/firebase';
import { getDocs, collection, addDoc, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage';

function App() {
  const [movieList, setMovieList] = useState([])

  // New Movie States
  const [newMovieTitle, setNewMovieTitle]= useState('');
  const [newReleaseDate, setNewReleaseDate]= useState(0);
  const [isNewMovieOscar, setIsNewMovieOscar]= useState(false);

  //Update Title State
  const [updatedTitle, setUpdatedTitle] = useState('')

  //File Upload state
  const [fileUpload, setFileUpload] = useState(null)
  const [fileList, setFileList]= useState([])

  const moviesCollectionRef = collection(db, 'movies')
  
  const getMovieList = async () => {
        // READ THE DATA
        try {
          const data = await getDocs(moviesCollectionRef);
          const filteredData = data.docs.map((doc)=>({
            ...doc.data(), 
            id: doc.id,
          }));
          // SET DATA
          setMovieList(filteredData);
        } catch (err) {
          console.error(err)
        }
    };

  useEffect(()=> {
  getMovieList();
  }, [])

  const onSubmitMovie = async() => {
    try {
    await addDoc(moviesCollectionRef, {
          title:newMovieTitle, 
          releaseDate: newReleaseDate,
          receivedAnOscar: isNewMovieOscar,
          userId: auth?.currentUser?.uid,
        });
        getMovieList();
        
    } catch (err) {
      console.error(err)
    }
  };
  const deleteMovie = async (id) => {
      const movieDoc = doc(db, 'movies', id)
      await deleteDoc(movieDoc)
  }
  const updateMovieTitle = async (id) => {
      const movieDoc = doc(db, 'movies', id)
      await updateDoc(movieDoc, {title: updatedTitle})
  }

  const fileListRef = ref(storage, 'projectFiles/');
  const uploadFile = async () => {
    if(!fileUpload) return;
    const filesFolderRef = ref(storage, `projectFiles/${fileUpload.name}`);
    try {
      await uploadBytes(filesFolderRef, fileUpload).then((snapshot)=>{
        getDownloadURL(snapshot.ref).then((url)=>{
        setFileList((prev)=>[...prev, url])
        })
        
      })
      
    } catch (err){
      console.error(err)
    }
  }
  useEffect(()=>{
    listAll(fileListRef).then((res)=> {
      res.items.forEach((item)=>{
        getDownloadURL(item).then((url)=> {
          setFileList((prev)=>[...prev, url])
        })
      })
    })
  }, []);

  return (
    <div>
      <div>
        <input 
        placeholder='Movie Title ... '
        type='text'
        onChange={(e)=>setNewMovieTitle(e.target.value)}
        />
        <input 
        placeholder='Release Date ... '
        type='number'
        onChange={(e)=>setNewReleaseDate(+(e.target.value))}
        />
        <input 
        type='checkbox'
        checked={isNewMovieOscar} //autochecked to match initial state
        onChange={(e)=>setIsNewMovieOscar(e.target.checked)}
        />
        <label>Received an Oscar </label>
        <button onClick={onSubmitMovie}>Submit Movie</button>
      </div>
      <Auth/>
      <div>{movieList.map((movie)=> (
        <div>
          <h1 style={{color: movie.receivedAnOscar ? 'green' : 'red'}}>{movie.title}</h1>
          <p>Date: {movie.releaseDate}</p>

          <button onClick={()=>deleteMovie(movie.id)}>Delete Movie</button>
          <input 
          placeholder='New Title ...'
          onChange={(e)=> setUpdatedTitle(e.target.value)}
          />
          <button onClick={()=>updateMovieTitle(movie.id)}>Update Title</button>
        </div>
      ))}
      </div>
      <div>
        <input 
        type='file'
        onChange={(e)=> setFileUpload(e.target.files[0])}
        />
        <button onClick={uploadFile}>Upload File</button>
      </div>
      <div>{fileList.map((url)=>{
        return <audio controls src={url} alt='files'/>
      })}
      </div>
    </div>
  );
}

export default App;
