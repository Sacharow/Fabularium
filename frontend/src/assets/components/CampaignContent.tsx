import { NavLink } from "react-router-dom";

export default function CampaignContent({ activeSection }: { activeSection: string }) {
    const outerContainerClass = `p-4`;
    const data =
        [
            "Map",
            "Locations",
            "Characters",
            "NPC",
            "Point of Interest",
            "Players",
            "Notes",
        ]

    const content = [
        {
            section: "Map",
            content: ["Księstwo Yoresa"],
            srcs: ["/map3.png"]
        },
        {
            section: "Locations",
            content: ["Cesarstwo Astyjskie", "Złote Imperium", "Księstwo Yoresa"],
            srcs: ["/sky1.jpg", "/sky2.jpg", "/sky3.jpg"]
        },
        {
            section: "Characters",
            content: ["Afold Dihler", "Bombardillo Crocodillo", "Magda", "Magda (znowu)", "Olivussy", ";-;", "Trebusz Pani Grzonki ", "Woldzimierz Futerkowicz Biały"],
            srcs: ["/afold.jpg", "/Bomber.png", "/mag.jpg", "/mag2.jpg", "/oliv.jpg", "/pan_bomba.jpg", "/trebusz.png", "/waltuh.jpg"]
        },
        {
            section: "NPC",
            content: ["Ratton", "Ratton", "Ratton", "Ratton", "Ratton", "Ratton", "Ratton"],
            srcs: ["/ratton.png", "/ratton.png", "/ratton.png", "/ratton.png", "/ratton.png", "/ratton.png", "/ratton.png"]
        },
        {
            section: "Notes",
            content: ["Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas dictum interdum ex venenatis consectetur. Aliquam tempor accumsan nibh, a suscipit lectus dictum sit amet. Maecenas euismod aliquam ipsum ut blandit. Ut ullamcorper urna lorem, commodo efficitur felis ornare eget. Maecenas laoreet blandit felis, ut iaculis magna. Quisque elementum nulla nec elit rutrum, in sollicitudin ante volutpat. Cras urna urna, interdum nec fringilla eget, ultrices eget dolor. Suspendisse ac tempor neque. Curabitur dapibus viverra quam, commodo bibendum sem sodales vel. Nulla gravida urna diam, vel lacinia nulla tempus at. Sed diam est, ultricies et pharetra id, mollis ut diam. Integer posuere ullamcorper quam nec luctus. Pellentesque scelerisque tempus purus, ac consequat nisi consectetur at. Fusce ut nibh ligula. Suspendisse ultricies quam ut ullamcorper tincidunt. Nulla nec tristique purus, venenatis vehicula magna. In aliquam cursus dolor, laoreet mollis ex ornare et. Quisque eu est mi. Vivamus sit amet semper mauris, at pharetra velit. Nunc condimentum elementum eleifend. Nam massa libero, tincidunt eget tempus at, scelerisque nec urna. Suspendisse aliquam ultrices est ut interdum. Aliquam ac ipsum metus.",
                "Cras viverra odio id tristique tempor. Praesent malesuada aliquam velit cursus molestie. Nullam sagittis ultrices risus eu iaculis. Morbi lobortis efficitur libero in consectetur. Fusce convallis mattis risus, nec dignissim urna pharetra in. Curabitur nibh sapien, porta id lacus efficitur, pellentesque fermentum dui. Proin nisi dui, suscipit eget dictum nec, posuere eu metus. Praesent dapibus nisi quis aliquam egestas. Donec id ipsum vitae est lacinia suscipit ac sed est. Etiam consectetur sem vitae nisl tincidunt, porttitor eleifend augue interdum. In lacinia posuere nunc. Duis volutpat at lacus quis convallis. Phasellus vehicula sapien quam, quis varius massa gravida vel. Maecenas id velit eros. Phasellus vitae sagittis risus. Cras eu ante orci. Fusce lacus dolor, commodo eu lectus et, maximus condimentum enim. Sed imperdiet finibus orci. Sed pellentesque sapien ligula, id tempus justo lobortis quis. In accumsan felis ac urna condimentum maximus. Vestibulum tincidunt tortor sed leo accumsan hendrerit. Curabitur tincidunt quis purus suscipit convallis. Aenean feugiat volutpat mattis. Etiam imperdiet massa arcu, sed gravida velit cursus eget. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
                "Maecenas vel arcu ut nisi porttitor fermentum tincidunt eu odio. Suspendisse potenti. Praesent sed accumsan urna, eu lacinia tortor. Donec et augue ac lacus accumsan semper vehicula vel dui. Aliquam dignissim, tortor sed dapibus ullamcorper, erat augue imperdiet nisi, non fringilla enim quam in justo. Nam blandit, lacus in semper faucibus, velit eros ultricies erat, quis ultricies ipsum lorem ut turpis. Pellentesque sit amet pulvinar leo, sit amet rutrum velit. Aliquam quis luctus felis, id ullamcorper nisl."
            ],
            srcs: ["/note1.jpg", "/note2.jpg", "/note3.jpg"]
        }
    ]

    return (
        <div>
            {data.map((item, index) => {
                if (activeSection !== item) return null

                const section = content.find(c => c.section === item)
                if (!section) return null

                return (
                    <div key={index} className={outerContainerClass}>
                        <h1 className="font-bold text-4xl">{item}</h1>

                        {item === "Notes" ? (
                            // Notes: render text-only cards (no <img>)
                            <div className="space-y-4 mt-4">
                                {section.content.map((note, i) => (
                                    <div key={i} className="border border-gray-300 rounded-lg overflow-hidden bg-orange-900/75 p-4">
                                        <p className="text-sm leading-relaxed">{note}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            // Other sections: render grid with optional images
                            <div className="grid grid-cols-3 gap-4 mt-4">
                                {section.content.map((contentItem, contentIndex) => (
                                    <button key={contentIndex} className="cursor-pointer hover:bg-orange-700/75 border border-gray-300 rounded-lg overflow-hidden bg-orange-900/75">
                                        <NavLink to="/InCampaign/Character">
                                        {section.srcs?.[contentIndex] ? (
                                            <img
                                                src={section.srcs[contentIndex]}
                                                alt={contentItem}
                                                className="w-full h-48 object-cover"
                                            />
                                        ) : null}
                                        <div className="p-4">
                                            <h2 className="font-semibold text-lg ">{contentItem}</h2>
                                        </div>
                                        </NavLink>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}