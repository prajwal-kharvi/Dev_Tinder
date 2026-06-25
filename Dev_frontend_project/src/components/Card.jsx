const card=({data,showRequestButton=false,onAccept,onReject})=>{
    const{_id,firstName,lastName,age,gender,photoUrl,about}=data

    return(
        <div className="card bg-slate-900 border border-slate-700 shadow-2xl text-slate-200 w-full max-w-3xl">
            <div className="flex flex-col md:flex-row">

                <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full md:w-40 h-40 object-cover"
                />

                <div className="card-body">
                    <h2 className="card-title text-2xl">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && <div className="badge badge-primary badge-outline w-fit">
                        {age}, {gender}
                    </div>}

                    <p className="text-slate-400">
                        {about}
                    </p>
                    {showRequestButton && <div className="card-actions justify-end mt-auto">
                        <button className="btn btn-error" onClick={()=>onReject(_id)}>Reject</button>

                        <button className="btn btn-success"onClick={()=>onAccept(_id)}>Accept</button>

                    </div>}
                </div>

            </div>
        </div>

    )
}

export default card