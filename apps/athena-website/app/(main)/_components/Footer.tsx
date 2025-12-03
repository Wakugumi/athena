import Logo from "@/app/_components/Logo";

export default function Footer() {
  return (
    <>

      <div className="mx-auto w-full px-6 py-6  bg-background ">
        <div className="flex flex-col gap-3 border-t items-start border-border pt-6 md:flex-row justify-center md:items-center">
          <p className="text-xs text-secondary">2025 Athena. All rights reserved.</p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary">
            <li><a href="#privacy" className="hover:text-foreground">Privacy Policy</a></li>
            <li><a href="#tos" className="hover:text-foreground">Terms of Service</a></li>
            <li><a href="#cookies" className="hover:text-foreground">Cookie Settings</a></li>
            <li><a href="#accessibility" className="hover:text-foreground">Accessibility</a></li>
          </ul>
        </div>
      </div>

    </>
  )
}
