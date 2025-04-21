interface WarningBox{
    err?: string | null;
    name?: string;
}

export default function Warning({err, name="Warning"} :WarningBox){


    return(
        <div className="relative w-full overflow-hidden rounded-xl border border-red-600 bg-white text-red-700" role="alert">
            <div className="flex w-full items-center gap-2 bg-red-600/10 p-4">
                <div className="bg-red-600/15 text-red-600 rounded-full p-1" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5">
                    <path fillRule="evenodd" d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" clipRule="evenodd" />
                </svg>
                </div>
                <div className="ml-2">
                <h3 className="text-sm font-semibold text-red-600">{name}</h3>
                <p className="text-xs font-medium sm:text-sm">
                   {err}
                </p>
                </div>
            </div>
        </div>
    )
}