import Navigation from "../components/Navigation";

export default function Root() {
    return (
        <>
            <div className="main_content"> 
                <Navigation /> {/* Outlet Component inside */}
            </div>
        </>
    )
  }