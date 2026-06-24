const UserCard=({user})=>{
    const {firstName,lastName,age,gender,photoUrl,about} =user
    return(
        <div>
            <div className="card w-96 h-[720px] bg-slate-900 border border-slate-700 shadow-2xl text-slate-200">
                <figure>
                    <img
                        className="rounded-t-xl w-full h-80 object-cover"
                        src={photoUrl}
                        alt="Profile"
                    />
                </figure>
                <div className="card-body flex flex-col gap-5">
                    <h2 className="card-title text-slate-300 ">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && (
                        <div className="badge badge-outline badge-primary ">
                            {age}, {gender}
                        </div>
                    )}

                    <p className="text-slate-400 leading-relaxed break-words flex-grow overflow-hidden">
                        {about}
                    </p>
                    <div className="card-actions justify-center gap-3 mt-auto">
                        <button className="btn btn-outline btn-secondary rounded-xl">
                            Ignore
                        </button>

                        <button className="btn btn-primary rounded-xl">
                            Interested
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserCard