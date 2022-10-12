import { 
    useEffect, 
    useState,
    useRef
} from "react"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'



export default function NewPost({ currentUser, setCurrentUser }){
    const [content, setContent] = useState("")
    const [errorMessage, setErrorMessage] = useState("")

    // Cloudinary 
    const [fileInputState, setFileInputState] = useState('')
    // const [selectedFile, setSelectedFile] = useState('')
    const [previewSource, setPreviewSource] = useState('')
    // const [imageIds, setImagesIds] = useState()
    

    // Multer
    const inputRef = useRef(null)
    const [formImg, setFormImg] = useState('')
    
    const [formStyle, setFormStyle] = useState('')
    const [imgSelected, setImgSelected] = useState('')

    const navigate = useNavigate()

    const handleFileInputChange = (e) => {
        const file = e.target.files[0]
        previewFile(file);
        setFormImg(file)
    }


    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file); //Converts the file to a url
        reader.onloadend = () => { //Once the reader is done loading
            setPreviewSource(reader.result);

        }
    }
    
    
    const handleCreate = async (e) => {
		e.preventDefault()
        if(!previewSource) return;
        // uploadImage(previewSource);
		try{
            const formData = new FormData()
            formData.append('image', formImg)
            formData.append('content', content)
            formData.append('userId', currentUser.id)
            const options = {
                headers: {
                    "Content-Type" : "multipart/form-data"
                }
            }
			const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/posts`, formData, options)
            if(inputRef) inputRef.current.value = '' 
			setContent("")
            navigate('/posts')
		}catch(err){
			setErrorMessage(err.message)
		}
	}
    // console.log("NEW POST",currentUser)
    
    const [formText, setFormText] = useState('Drag and drop or browse to upload an image')
    const [formSize, setFormSize] = useState('100px')
    const [formWidth, setFormWidth] = useState('400px')
    const [padding, setPadding] = useState('2em')
    const [left, setLeft] = useState('-30px')
  const handleFormStyle = (e) => {
    if(previewSource != ""){
        setFormStyle('transparent')
        setFormText('Image uploaded successfully! Wrong image? Click to upload a new one.')
        setFormSize('45px')
        setFormWidth('109px')
        setPadding('4px 16px')
        setLeft('-10px')
    }
  }

    useEffect(() => {
        handleFormStyle()
    }, [previewSource])

 

    return(
        <div>
            <h1>New Post</h1>
            <form>   
            <label htmlFor="file" >{formText} </label>
                <input 
                    type = "file"
                    // title = "Browse Files or Drag and drop " 
                    id = "image"
                    ref = {inputRef}
                    onChange={handleFileInputChange} 
                    value={fileInputState}   
                    style= {{
                        padding: padding,
                        height: formSize, 
                        fontSize: "14pt", 
                        width: formWidth,
                        color : formStyle, 
                        left: left, 
                        position: "relative",
                        accept: ".jpg, .jpeg, .png"
                        
                    }} 
                    />
                     {previewSource && ( //If previewSource is true, then show the image
                <img 
                src={previewSource} alt="User uploaded image" 
                style={{height: '400px', width: '500px', position: 'relative', left: '-90px'}}
                
            />
            
            )}

                <label htmlFor="content">Caption: </label>
                <input 
                    type="text" 
                    name="content" 
                    id="content" 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)}
                   style= {{height: "200px", fontSize: "14pt", width: "400px", left: "-30px", top: "00px", position: "relative"}}
                    />

               
                <button type="submit" style = {{backgroundColor: '#FC6767', width: '150px' }} onClick={handleCreate}>Submit</button>
            </form>
           
        </div>
    )
}