interface WarningBox{
    mssg?: string | null;
    name?: string;
}

export default function Warning({mssg, name = "Be aware"} :WarningBox){

    return(
        <div className="relative w-full overflow-hidden rounded-xl border border-sky-600 bg-white text-slate-700" role="alert">
            <div className="flex w-full items-center gap-2 bg-sky-600/10 p-4">
                <div className="bg-sky-600/15 text-sky-600 rounded-full p-1" aria-hidden="true">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-6" aria-hidden="true">
                        <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z" clipRule="evenodd" />
                    </svg>
                </div>
                <div className="ml-2">
                    <h3 className="text-sm font-semibold text-sky-600">{name}</h3>
                    <p className="text-xs font-medium sm:text-sm">{mssg}</p>
                </div>
            </div>
        </div>
    )

}