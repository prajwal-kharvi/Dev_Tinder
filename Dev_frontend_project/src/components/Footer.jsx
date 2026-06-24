const Footer=()=>{
    return(
        <footer className="footer sm:footer-horizontal footer-center bg-slate-950  p-4 fixed bottom-0 text-slate-200">
            <aside>
                <p>Copyright © {new Date().getFullYear()} - All right reserved by ACME Industries Ltd</p>
            </aside>
        </footer>
    )
}

export default Footer