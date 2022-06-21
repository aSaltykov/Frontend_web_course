import React, { useEffect, useState } from 'react'
import APIService from '../APIService'
import { useParams } from 'react-router-dom'
import { useCookies } from 'react-cookie'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import PopUp from './PopUp'


function Post() {
    const { id } = useParams()
    const [myId, setMyId] = useState(0)
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [image, setImage] = useState(null)
    const [token,] = useCookies(['mytoken'])

    const [posts, setPosts] = useState([])
    const [postText, setPostText] = useState('')
    const [postFile, setPostFile] = useState(null)

    const [commentText, setCommentText] = useState('')
    const [commentFile, setCommentFile] = useState(null)

    const [showComments, setShowComments] = useState(false)
    const [buttonPopPp, setButtonPopUp] = useState(false)
    const [popUpImage, setPopUpImage] = useState('')



    let navigate = useNavigate()
    const profileBtn = (profile_id) => {
        navigate(`/profile/${profile_id}`)
        window.location.reload()
    }

    useEffect(() => {
        APIService.GetMyProfile(token["mytoken"])
            .then(resp => {
                setMyId(resp[0]['id'])
            })
    }, [])


    useEffect(() => {
        APIService.GetPosts(id, token["mytoken"])
            .then(resp => {
                setPosts(resp[0]['Posts'])
            })

    }, [])

    useEffect(() => {
        APIService.GetProfile(id, token["mytoken"])
            .then(resp => {
                setFirstName(resp[0]['user_first_name'])
                setLastName(resp[0]['user_last_name'])
                setImage(resp[0]['image'])
            })

    }, [])

    const handlePostFile = (e) => {
        setPostFile(e.target.files[0])
        e.target.value = null
    }

    const handleCommentFile = (e) => {
        setCommentFile(e.target.files[0])
        e.target.value = null
    }

    const setterShowComments = (id, value) => {
        setCommentFile(null)
        setCommentText('')
        var newShowComments = {}
        newShowComments[id] = value
        setShowComments(newShowComments)
    }

    const likeBtn = (post_id) => {
        APIService.LikeUnlike(post_id, token["mytoken"])
            .then(() => {
                APIService.GetPosts(id, token["mytoken"])
                    .then(resp => {
                        setPosts(resp[0]['Posts'])
                    })
            })
    }

    const CommentLikeBtn = (comment_id) => {
        APIService.CommentLikeUnlike(comment_id, token["mytoken"])
            .then(() => {
                APIService.GetPosts(id, token["mytoken"])
                    .then(resp => {
                        setPosts(resp[0]['Posts'])
                    })
            })
    }

    const sendMesBtn = () => {
        let formData = new FormData()

        postFile && formData.append('image', postFile)
        postText && formData.append('text', postText)
        setPostFile(null)
        setPostText('')
        axios({
            url: 'http://127.0.0.1:8000/post/',
            method: 'POST',
            headers: {
                'Authorization': `Token ${token["mytoken"]}`
            },
            data: formData
        }).then(
            APIService.GetPosts(id, token["mytoken"])
            .then(resp => {
                setPosts(resp[0]['Posts'])
            })
        )
    }


    const sendCommentBtn = (postId) => {
        let formData = new FormData()

        commentFile && formData.append('image', commentFile)
        commentText && formData.append('text', commentText)
        setCommentFile(null)
        setCommentText('')
        axios({
            url: `http://127.0.0.1:8000/post_comment/${postId}/`,
            method: 'POST',
            headers: {
                'Authorization': `Token ${token["mytoken"]}`
            },
            data: formData
        }).then(
            APIService.GetPosts(id, token["mytoken"])
            .then(resp => {
                setPosts(resp[0]['Posts'])
            })
        )

    }

    return (
        <div class="card-post">
            {id == myId &&
                <div >
                    <div class="card-footer">
                        <div class="input-group">
                            <textarea name="" class="form-control type_msg" placeholder="Create your post" value={postText} onChange={e => setPostText(e.target.value)}></textarea>
                            <label onChange={e => handlePostFile(e)} class="input-group-append">
                                <input name="file" type="file" hidden />
                                <div class="fonts send_btn"><i class="fas fa-paperclip">{postFile && ' 1'}</i></div>
                            </label>
                            <div class="input-group-append" onClick={sendMesBtn}>
                                <span class="input-group-text send_btn"><i class="fas fa-location-arrow" ></i></span>
                            </div>
                        </div>
                    </div>
                    <hr />
                </div>
            }


            {posts.map(post =>
                <div>
                    <div class="d-flex justify-content-between p-2 px-3">
                        <div class="d-flex flex-row align-items-center">
                            {image ? <input type="image" src={image} class="rounded-circle post_img" onClick={() => profileBtn(post.profile)} /> :
                                <input type="image" src="https://www.seekpng.com/png/detail/13-134135_question-mark-emblem-bo-question-mark-clip-art.png" class="rounded-circle post_img" onClick={() => profileBtn(post.profile)} />}
                            <div class="d-flex flex-column ml-2">
                                <a href={`/profile/${id}`} class="link-text">{firstName} {lastName}</a>
                            </div>
                        </div>
                        <div class="d-flex flex-row mt-1 ellipsis">
                            <small class="mr-2">{post.created_at}</small>
                        </div>
                    </div>
                    <div class="center">
                        {post.image &&
                            <input type="image" src={post.image} class="img_post" onClick={() => (setButtonPopUp(true), setPopUpImage(post.image))} />
                        }
                        <p class="text-justify">{post.text}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <div class="d-flex flex-row icons d-flex align-items-center">
                                {post.likes_amount}
                                <span class="btn">
                                    {post.is_liked ? <i class="fa fa-heart" onClick={() => likeBtn(post.id)}></i> : <i class="far fa-heart" onClick={() => likeBtn(post.id)}></i>}
                                </span>
                                <button class="astext" onClick={() => setterShowComments(post.id, true)}><div class="profile-stats">{post.comments.length} Comments</div></button>
                            </div>

                        </div>

                    </div>
                    <div class="p-2 center">
                        {showComments[post.id] &&
                            <div>
                                <hr />
                                <button class="astext" onClick={() => setterShowComments(post.id, false)}><div class="profile-stats">Close</div></button>
                                <div class="input-group mb-2">
                                    <textarea name="" class="form-control type_msg" placeholder="Write your comment..." value={commentText} onChange={e => setCommentText(e.target.value)}></textarea>
                                    <label onChange={e => handleCommentFile(e)} class="input-group-append">
                                        <input name="file" type="file" hidden />
                                        <div class="fonts send_btn"><i class="fas fa-paperclip">{commentFile && ' 1'}</i></div>

                                    </label>
                                    <div class="input-group-append" onClick={() => sendCommentBtn(post.id)}>
                                        <span class="input-group-text send_btn"><i class="fas fa-location-arrow" ></i></span>
                                    </div>
                                </div>

                                {post.comments.map(comment =>
                                    <div class="d-flex flex-row mb-2">
                                        {comment.comment_profile_image ? <input type="image" src={comment.comment_profile_image} class="rounded-circle post_img" onClick={() => profileBtn(comment.comment_profile_id)} /> :
                                            <input type="image" src="https://www.seekpng.com/png/detail/13-134135_question-mark-emblem-bo-question-mark-clip-art.png" class="rounded-circle post_img" onClick={() => profileBtn(comment.comment_profile_id)} />}
                                        <div class="d-flex flex-column ml-2">
                                            <a href={`/profile/${comment.comment_profile_id}`} class="link-text">{comment.comment_profile_first_name} {comment.comment_profile_last_name}</a>

                                            {comment.image &&
                                                <input type="image" src={comment.image} class="img_comment" onClick={() => (setButtonPopUp(true), setPopUpImage(comment.image))} />
                                            }
                                            {comment.text}

                                            <div class="d-flex flex-row icons-comment align-items-center status">
                                                <small>
                                                    {comment.comment_likes_amount}
                                                    <span class="btn">
                                                        {comment.comment_is_liked ? <i class="fa fa-heart" onClick={() => CommentLikeBtn(comment.id)}></i> : <i class="far fa-heart" onClick={() => CommentLikeBtn(comment.id)}></i>}
                                                    </span>

                                                </small>
                                                <small class="mr-2">{comment.created_at}</small>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    <hr />
                </div>
            )}
            <PopUp trigger={buttonPopPp} setTrigger={setButtonPopUp} image={popUpImage} />
        </div>
    )
}

export default Post