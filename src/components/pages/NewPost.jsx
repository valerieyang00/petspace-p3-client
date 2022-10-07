export default function NewPost(){
    return(
        <div>
            <h1>New Post</h1>
            <form>   
                <label htmlFor="content">Content</label>
                <input type="text" name="content" id="content"/>
                {/* <input hidden type="text" name="user" id="user"/> */}
                    {/* for when we add image upload functionality */}
                {/* <label htmlFor="image_url">Image URL</label> */}
                {/* <input type="file" name="image_url" id="image_url"/> */}
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}