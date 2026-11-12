import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui";

export const metadata: Metadata = {
  title: "History",
  description: "Oregon — land, people, and time. The natural and human history of Oregon and its tribal nations.",
};

const U = "/images/history";

const overview = [
  {
    title: "1. Deep time and the shaping of the land",
    text: "Oregon’s physical character is the product of geologic dynamism: volcanic eruptions, basalt flows, glaciation, and the slow carving of river canyons. The Cascade Range, the Columbia River Gorge, the lava fields of eastern Oregon, and the coastal headlands each have distinct geological origins that support very different ecosystems and ways of life.",
  },
  {
    title: "2. First peoples and millennia of stewardship",
    text: "For thousands of years before European contact, people lived throughout what is now Oregon in complex seasonal patterns tied to salmon runs, root and seed harvests, and trade routes that crossed mountains and rivers. These societies developed specialized technologies — fish weirs, basketry, canoe craft, and seasonal land management practices — that reflect deep local knowledge of soil, water, and wildlife.",
  },
  {
    title: "3. Contact, colonization, and transformation",
    text: "European and American exploration and the ensuing fur trade in the 18th and early 19th centuries created new economic networks and introduced diseases that devastated Indigenous populations in many regions. In the 1840s and 1850s, the Oregon Trail brought tens of thousands of emigrants, accelerating territorial settlement and the creation of new political structures that culminated in Oregon’s admission to the Union in 1859. Those decades reshaped land tenure, governance, and resource use across the region.",
  },
  {
    title: "4. Modern Oregon",
    text: "By the late 19th and 20th centuries, Oregon developed industries anchored in timber, agriculture, fishing, and railroads. Over time, the state also became a center for conservation thinking, outdoor recreation, and a modern tourism economy that celebrates both natural wonders and cultural histories. Today’s Oregon remains a place of contrasts: densely urbanized centers and remote wilderness; technological innovation and traditional cultural practice — all woven into a shared landscape.",
  },
];

/** Add a tribe here and a new section appears — no new page design needed. */
const tribes = [
  {
    name: "Burns Paiute Tribe",
    photo: "tribe-1-photo.png",
    overlay: "tribe-1-badge.png",
    text: "The Burns Paiute are Northern Paiute people whose connections span eastern Oregon’s high desert and basin lands. Historically, their lifeways centered on seasonal movement across wide plains and around lake and marsh resources. Traditional foods such as camas, seeds and game, plus distinctive basketry and knowledge of the high desert ecology, underline a cultural relationship to place that continues today. The Burns Paiute maintain tribal programs focused on cultural preservation, health services, and economic development.",
  },
  {
    name: "Confederated Tribes of the Coos, Lower Umpqua & Siuslaw Indians",
    photo: "tribe-2-photo.png",
    overlay: "tribe-2-badge.png",
    text: "Made up of several local tribes and bands from Oregon’s southern and central coast, these nations have long been anchored in a maritime lifeway: canoe-building, sea and estuary fishing, and maritime craft. Their cultural calendar and ceremonial life reflect deep ties to coastal resources, and today the Confederated Tribes work to revive language, protect fish habitat, and sustain tribal enterprises.",
  },
  {
    name: "Confederated Tribes of the Grand Ronde",
    photo: "tribe-3-photo.png",
    overlay: "tribe-3-badge.png",
    text: "The Grand Ronde Confederation brings together many tribal bands from across western Oregon, northern California, and southwest Washington. The tribe’s history includes relocation and re-organization across the 19th and 20th centuries; today Grand Ronde operates cultural centers, language revival programs, and community services that support tribal members and guests interested in Indigenous histories.",
  },
  {
    name: "Confederated Tribes of Siletz Indians",
    photo: "tribe-4-photo.png",
    overlay: "tribe-4-badge.png",
    text: "The Siletz are a confederation of dozens of western Oregon tribal groups whose homelands stretch across the Oregon Coast and inland valleys. Despite 19th- and 20th-century upheavals (including forced removal and termination-era policies), the Siletz have rebuilt many cultural and governance institutions. Recent legal victories have restored important rights around hunting, fishing, and gathering — milestones in a long effort to reclaim tribal sovereignty and stewardship.",
  },
  {
    name: "Confederated Tribes of the Umatilla Indian Reservation",
    photo: "tribe-5-photo.png",
    overlay: "tribe-5-badge.png",
    text: "Composed primarily of the Cayuse, Umatilla, and Walla Walla peoples, the Umatilla Confederation historically occupied lands along the Columbia Plateau and nearby river corridors. Their cultural life has strong traditions of fishing (especially salmon), horse culture, and longhouse ceremony. Today the tribe runs cultural and natural resource programs that support fisheries restoration, youth education, and community health.",
  },
  {
    name: "Confederated Tribes of Warm Springs",
    photo: "tribe-6-photo.png",
    overlay: "tribe-6-badge.png",
    text: "The Warm Springs Indian Reservation stretches from the summit of the Cascade Mountains to the Deschutes River in North Central Oregon. The Confederated Tribes of Warm Springs includes the Warm Springs, Wasco and Paiute Tribes. In 1937, the three Tribes organized as the Confederated Tribes of the Warm Springs Reservation of Oregon by adopting a Constitution and bylaws for Tribal government. Despite the great loss of traditional culture that occurred as a result of settlement on the reservation, the people of the Warm Springs Reservation have succeeded in holding on to many of their ancient traditions and values. Their longhouses still ring with prayer songs that have been handed down for generations.",
  },
  {
    name: "Cow Creek Band of Umpqua Tribe of Indians",
    photo: "tribe-7-photo.png",
    overlay: "tribe-7-badge.png",
    text: "The Cow Creek Tribal Nation, located in Southwestern Oregon, has over 1,800 members who are governed by an elected eleven-member council known as the Tribal Board of Directors. The Cow Creek Tribe has a rich history in southern Oregon that reflects hard work, perseverance and the desire to be self-reliant. The Cow Creek Tribe never received the reservation their Treaty promised. Even without a reservation, the people remained in their homelands. The Tribal Government Office, located in Roseburg, Oregon, houses not only the Tribal Government body and programs, but also the Cow Creek Tribal Gaming Commission and the Cow Creek Health and Wellness Center.",
  },
  {
    name: "Coquille Indian Tribe",
    photo: "tribe-8-photo.png",
    overlay: "tribe-8-badge.png",
    text: "The Coquille Tribe has more than 1,100 members and has regained more than 10,000 acres of their ancestral homeland. Comprising a people whose ancestors lived in the lands of the Coquille River watershed and lower Coos Bay, the Coquille Indian Tribe’s service area covers 15,603 square miles of Coos, Curry, Douglas, Jackson and Lane counties. Approximately 350 Tribal members live in Coos County. After the United States reinstituted federal recognition to the Tribe and restored its full sovereignty rights in 1989, the Coquille Tribal government created an administrative program that now provides housing, health care, education, elder care, law enforcement and judicial services to its members.",
  },
  {
    name: "The Klamath Tribes",
    photo: "tribe-9-photo.png",
    overlay: "tribe-9-badge.png",
    text: "Centered historically around the Upper Klamath Basin and its lakes, the Klamath peoples (including Klamath, Modoc, and Yahooskin groups) developed lifeways that relied on freshwater fisheries, marshlands, and migratory patterns. Their knowledge of wetland ecology and seasonal resource cycles has been central to their identity. Contemporary tribal efforts focus on cultural resilience, water and habitat restoration, and intergenerational cultural transmission.",
  },
];

export default function HistoryPage() {
  return (
    <>
      <PageHero title="History" image={`${U}/hero.png`} />

      <section className="section history-intro">
        <div className="container inner">
          <div>
            <h2>Oregon - Land, People, and Time</h2>
            <p>
              Oregon’s landscape reads like a travelogue written by the planet: jagged coastline, emerald rainforests, high
              desert, volcanic peaks, broad valleys and meandering rivers. Those physical features shaped human life here
              for millennia — from the knowledge systems of Indigenous nations who stewarded these places to the waves of
              settlers, traders, and entrepreneurs who arrived in later centuries. This page tells two interwoven stories:
              the long natural and human history of Oregon, and the living presence of the tribes who continue to care for
              country and culture today.
            </p>
          </div>
          <div style={{ position: "relative", aspectRatio: "858 / 780" }}>
            <Image src={`${U}/collage.png`} alt="Oregon landscape collage" fill sizes="(max-width: 860px) 100vw, 560px" />
          </div>
        </div>
      </section>

      <section className="section overview" style={{ paddingBottom: 0 }}>
        <div className="container">
          <h2 className="section-title center">
            Oregon
            <br />A more detailed historical overview
          </h2>
          <div className="cols">
            <div>
              {[overview[0], overview[2]].map((o) => (
                <div key={o.title}>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              ))}
            </div>
            <div style={{ position: "relative", aspectRatio: "1384 / 1114", alignSelf: "end" }}>
              <Image
                src={`${U}/lighthouse.png`}
                alt="Cape Disappointment lighthouse"
                fill
                sizes="(max-width: 860px) 100vw, 440px"
              />
            </div>
            <div>
              {[overview[1], overview[3]].map((o) => (
                <div key={o.title}>
                  <h3>{o.title}</h3>
                  <p>{o.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {tribes.map((t, i) => (
        <section key={t.name} className={`section tribe${i % 2 ? " flip" : ""}`}>
          <div className="container inner">
            <div className="photo">
              <Image src={`${U}/${t.photo}`} alt={t.name} fill sizes="(max-width: 860px) 100vw, 600px" />
              <Image src={`${U}/${t.overlay}`} alt="" fill sizes="(max-width: 860px) 100vw, 600px" style={{ padding: "2%" }} />
            </div>
            <div>
              <h2>
                {i + 1}. {t.name}
              </h2>
              <p>{t.text}</p>
              <a href="#" className="btn btn-orange">Donate Now</a>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
