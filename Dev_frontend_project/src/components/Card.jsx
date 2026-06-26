const card=({data,showRequestButton=false,onAccept,onReject})=>{
    const{_id,firstName,lastName,age,gender,photoUrl,about}=data

    return(
        <div className="card bg-slate-900 border border-slate-700 shadow-2xl text-slate-200 w-full max-w-3xl mx-auto">
            <div className="flex flex-col md:flex-row">

                <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-56 md:w-48 md:h-auto object-cover"
                />

                <div className="card-body text-center md:text-left">
                    <h2 className="card-title text-2xl justify-center md:justify-start">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && (
                        <div className="badge badge-primary badge-outline w-fit mx-auto md:mx-0">
                            {age}, {gender}
                        </div>
                    )}

                    <p className="text-slate-400">
                        {about}
                    </p>

                    {showRequestButton && (
                        <div className="card-actions flex-col sm:flex-row justify-center md:justify-end mt-auto">
                            <button
                                className="btn btn-error w-full sm:w-auto"
                                onClick={() => onReject(_id)}
                            >
                                Reject
                            </button>

                            <button
                                className="btn btn-success w-full sm:w-auto"
                                onClick={() => onAccept(_id)}
                            >
                                Accept
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>

    )
}

export default card