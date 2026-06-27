const EmptyState=({icon,title,message})=>{
    return(
        <div className="flex flex-col item-center justify-center py-24 text-center">
            <div className="text-7xl">{icon}</div>
            <h2 className="text-4xl font-bold text-white mt-4">{title}</h2>
            <p className="text-slate-400 mt-3">{message}</p>
        </div>
    )
}


export default EmptyState