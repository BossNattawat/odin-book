import { Search } from "lucide-react"
import Link from "next/link"

const people = [
  {
    displayName: "Onion",
    username: "onion8041"
  },
  {
    displayName: "Onion",
    username: "onion8041"
  },
  {
    displayName: "Onion",
    username: "onion8041"
  },
]

function Explore() {
  return (
    <aside className="min-h-screen border-l-[1px] border-slate-600 px-8 py-3 min-w-[26rem] hidden xl:flex flex-col gap-8">
        <section>
          <label className="input w-full rounded-xl">
            <Search/>
            <input type="text" className="grow" placeholder="Search" />
          </label>          
        </section>
        <section className="p-5 border-[2px] border-slate-600 rounded-xl">
          <h2 className="text-xl font-medium">People to follow</h2>
          <div className="flex flex-col">
            {people.map((person, index) => (
              <div key={index} className="flex justify-between my-2 gap-3 hover:bg-slate-800 py-2 rounded-md duration-300">
                <div className="flex gap-3">
                  <img src="/avatar.png" alt="profile" width={50} className="rounded-full" />
                  <div className="flex flex-col">
                      <p className="font-semibold">{person.displayName}</p>
                      <p className="text-gray-400">@{person.username}</p>
                  </div>
                </div>
                <button className="btn btn-primary rounded-xl">Follow</button>
              </div>
            ))}
          </div>
          <Link href="/" className="text-blue-400">Show more</Link>
        </section>
    </aside>
  )
}

export default Explore