import { Link } from "react-router-dom";

const Card = ({ data, showRequestButton = false, onAccept, onReject }) => {
    const {
        _id,
        firstName,
        lastName,
        age,
        gender,
        photoUrl,
        about
    } = data;

    return (
        <div className="card w-full max-w-3xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 hover:border-indigo-500 hover:shadow-indigo-500/20">

            <div className="flex flex-col md:flex-row">

                <img
                    src={photoUrl}
                    alt="Profile"
                    className="w-full h-56 md:w-52 md:h-auto object-cover"
                />

                <div className="card-body">

                    <h2 className="text-2xl font-bold text-white">
                        {firstName} {lastName}
                    </h2>

                    {age && gender && (
                        <div className="badge bg-indigo-500 text-white border-none w-fit">
                            {age} • {gender}
                        </div>
                    )}

                    <p className="text-slate-400 leading-7 mt-3">
                        {about}
                    </p>

                    <div className="card-actions justify-end gap-4 mt-6">

                        {showRequestButton && (
                            <>
                                <button
                                    className="btn btn-outline border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105"
                                    onClick={() => onReject(_id)}
                                >
                                    ❌ Reject
                                </button>

                                <button
                                    className="btn bg-indigo-500 hover:bg-indigo-600 border-none text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/40"
                                    onClick={() => onAccept(_id)}
                                >
                                    ✅ Accept
                                </button>
                            </>
                        )}

                        <Link to={`/chat/${_id}`}>
                            <button
                                className="btn bg-emerald-500 hover:bg-emerald-600 border-none text-white transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:shadow-lg hover:shadow-emerald-500/40"
                            >
                                💬 Chat
                            </button>
                        </Link>

                    </div>

                </div>
            </div>
        </div>
    );
};

export default Card;