import Logo from "@/app/_components/Logo";

export default function Footer() {
    return (
        <>
            <footer className="bg-background border-t border-border">
                <div className="mx-auto max-w-7xl px-6 py-12">
                    <div className="grid gap-10 md:grid-cols-4">
                        <div>
                            <div className="mb-3"><Logo variant="inline" /></div>
                            <p className="text-sm text-secondary max-w-xs">Share, Trade, and Access Quality Lecture Notes.</p>
                        </div>
                        <div>
                            <div className="font-medium text-foreground">Company</div>
                            <ul className="mt-3 space-y-2 text-sm text-secondary">
                                <li><a href="#about" className="hover:text-foreground">About Us</a></li>
                                <li><a href="#how" className="hover:text-foreground">How it works</a></li>
                                <li><a href="#community" className="hover:text-foreground">Community</a></li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-medium text-foreground">Support</div>
                            <ul className="mt-3 space-y-2 text-sm text-secondary">
                                <li><a href="#help" className="hover:text-foreground">Help Center</a></li>
                                <li><a href="#contact" className="hover:text-foreground">Contact Us</a></li>
                                <li><a href="#feedback" className="hover:text-foreground">Submit Feedback</a></li>
                            </ul>
                        </div>
                        <div>
                            <div className="font-medium text-foreground">Learn</div>
                            <ul className="mt-3 space-y-2 text-sm text-secondary">
                                <li><a href="#newsroom" className="hover:text-foreground">Newsroom</a></li>
                                <li><a href="#events" className="hover:text-foreground">Events</a></li>
                                <li><a href="#donate" className="hover:text-foreground">Donate</a></li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-10 flex flex-col items-start gap-3 border-t border-border pt-6 md:flex-row md:items-center md:justify-between">
                        <p className="text-xs text-secondary">2025 Athena. All rights reserved.</p>
                        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-secondary">
                            <li><a href="#privacy" className="hover:text-foreground">Privacy Policy</a></li>
                            <li><a href="#tos" className="hover:text-foreground">Terms of Service</a></li>
                            <li><a href="#cookies" className="hover:text-foreground">Cookie Settings</a></li>
                            <li><a href="#accessibility" className="hover:text-foreground">Accessibility</a></li>
                        </ul>
                    </div>
                </div>
            </footer>
        </>
    )
}