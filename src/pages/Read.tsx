
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  BookOpen, Search, ChevronLeft, ChevronRight, X,
  Share, ZoomIn, ZoomOut, Printer, ExternalLink, Download,
  Bookmark, Headphones
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import PageTransition from '@/components/PageTransition';
import ListenDialog from '@/components/ListenDialog';

const Read = () => {
  const [activeTab, setActiveTab] = useState('1');
  const [scale, setScale] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isSpreadView, setIsSpreadView] = useState(true);
  const [showUI, setShowUI] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [isPageTurning, setIsPageTurning] = useState(false);
  const [pageDirection, setPageDirection] = useState<'next' | 'prev'>('next');
  const [listenDialogOpen, setListenDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth < 1024) {
      setIsSpreadView(false);
    }
  }, [windowWidth]);

  const chapters = [
    {
      id: 1,
      title: "CHAPTER 1: HAVE A PLAN",
      theme: "Planning",
      content: `I spend a lot of time talking with small business owners about the stresses and strains of running their businesses. They will talk about lack of money, staff not doing what they should do,  rising costs, awkward suppliers and a whole raft of operational issues that stress a business owner.

However, more often than not, as I talk with the business owners, it becomes glaringly apparent that they do not have a plan for where the business is going. They don't have a sense of direction. This causes the owner a huge number of problems and consequently significantly increases their stress levels.

Why Do You Need a Plan?

Having a plan for your business is essential for several compelling reasons.

1. It will significantly reduce your stress levels by providing a clear sense of purpose and direction, alleviating that sense of the business being a constant grind that can be so exhausting.

2. A well-structured plan will empower you to distinguish good opportunities from bad ones, enabling you to make informed decisions about which projects will genuinely help you achieve your goals. This sense of empowerment will boost your confidence and capability as a business owner.

3. It will resolve the dilemma of how you allocate your limited time and money. You can do this much more effectively when you have a clear vision of where you want your business to go.

4. A plan ensures that your team has guidance in their day-to-day decisions, helping them prioritise tasks, concentrate on the right customers, and make choices that support the business's objectives.

5. A well-articulated plan is crucial for securing financial backing from investors or banks. It will demonstrate how the company will use the investment, what it will achieve as a result, and how it will repay the investment. This can be a key factor in convincing potential investors or lenders of the viability of your business.

That's where this book will start; I will help you create a plan. Your plan will give you a sense of direction and a business model for getting there. In creating a plan, you will also ask, "What do you want to do when you reach your preferred destination? Will you want to sell the business or pass it on to family members? What do you want your legacy to be?"

Throughout Prosper With Purpose, you will see references to environmental and social considerations. These are increasingly impinging on business decisions whether or not the owner cares about them. It's becoming clearer by the day that both customers and staff are increasingly concerned about these issues, and companies need to build these concerns into their planning.

The subsequent sections on People and Profits will discuss how to develop the two most essential resources required to implement any successful plan.

There are libraries worth of books published on how to plan. However, for a small business owner, it's relatively simple. There are three key ingredients. First, you need to know where you want to go and what you want to achieve with your business. Second, you need a business model for how you're going to do that. Finally, you will decide what actions you will take to implement the model so you get to where you want to go.

⚠️ Warning
When you picked up Prosper With Purpose, did you think, "This sounds good: I want to grow so that I can pay myself"? If you did, my alarm bells are ringing.

It's a very common answer; I meet it a lot. You feel you're not earning any money now because you haven't grown the business enough. That may well be true, but before you go any further, I want you to stop reading here, and I want you to go directly to Chapter 16.

Let's ensure you've got the business model right financially before considering growing. If you don't, you'll find yourself working even harder and longer and still have nothing to show for it.

Do you need to grow so you can pay yourself? Go to Chapter 16 Making Money and Getting Paid now.`,
      summary: "Establishing a clear mission and vision is fundamental to building a sustainable business that outlasts its founder.",
      quote: "A business without a mission is like a ship without a rudder - it may float, but it won't go anywhere meaningful."
    },
    {
      id: 2,
      title: "CHAPTER 2: DIRECTION",
      theme: "Vision",
      content: `The most important thing in business is knowing where you want to go and how you'll get there. You wouldn't get in a car without knowing where you wanted to go. Most people wouldn't take a job without an idea of what prospects it offers.

So why not have a destination for your business? Where would you like it to take you?

When you close your eyes, what does your future look like? How do you imagine you and your business being in three to five years? What does the destination look like? Can you describe the business and how your life would be different?

Some key questions to ask yourself:
What should be the benefits of running your business?
Where would you like to be spending your time?
What would you like to be doing with your family?
What would you like to be doing with your leisure time?
How much time do you envisage spending at work?
What do you want to be doing when you are at work?
Do you want to be famous?
Do you want to be wealthy?
Do you want recognition from your business sector?

In a nutshell, the above questions will answer the ultimate question: what do you want?

In terms of your business, ask yourself the following questions:
What do you want your business to look like?
Do you want it to be highly regarded in the locality?
Do you want it to earn plaudits internationally?
Do you want it to win prizes?
Do you want it to be regarded as the best in the sector?
What do you want it to be?

The bottom line is, what is your dream?

These are crucial questions to ask yourself when running a business. What is it that you want the business to do, and in particular do for you?

Without a Mission, You Waste Energy
I firmly believe you need to start how you intend to carry on. You need to start your journey in business in line with where you want to end up.

Having that clear line of sight enables you to really focus your energy. It will allow you to concentrate your limited resources of time and money on the ultimate goal and not waste them on diversionary activities.

I illustrate this in the following case study.

🔎 Case Study
I once worked with a lady I'll call Beatrice, who wanted to set up a travel agency for Francophone West Africa. Beatrice was from that area, spoke French and English well, and had many necessary contacts.

However, she thought she needed more money to start the business. She wanted my advice about setting up a sandwich-making business to earn this money, which she could then use to set up the travel agency.

I asked her, "Do you have any experience in catering?" She replied, "Absolutely none" I continued, "Do you think you'd like making sandwiches?" She said, "I can't imagine anything worse. It's boring and tedious." I questioned, "Why on earth would you want to do that? "I think it's a way of making some money, and that will enable me to start my travel agency," she explained.

I then told Beatrice, "I think you will waste a lot of energy going in the wrong direction. You should set off from day one to be a travel agent for the West African diaspora."

We then talked about the strategy of starting up a small travel agent business, gradually getting some early sales, selling itineraries and moving through the gears in a way that aligned with her ultimate ambition to be a travel agent. Beatrice dropped the sandwich-making idea completely and instead focussed her energies on organising travel to West Africa.

What's the Big Deal with Mission?
Why have I started this book with such a big emphasis on knowing where you want to go? The following case study demonstrates the power of a business mission.

🔎 Case Study
When I began Green-Works, I  met a fabulous man called Peter Lehman, a recently retired commercial director for Centrica who was a very generous but astute businessman. I cheekily asked him if he would help me develop Green-Works, a tiny company with about £20,000 turnover.

At the time, I was about to go into hospital for a knee operation, so I was wholly dependent on a part-time, 24-year-old history graduate driving a rented vehicle. He looked at me and said, "Tell me. What do you want to achieve in Green-Works? What's the mission?" I replied quite simply. "I want to make a significant, measurable difference to the amount of office furniture that goes to landfill, and I want to create a new culture of reuse and recycling around it."

Peter was impressed and agreed to join the board as chairman, saying, "That's a powerful ambition, and I like it, but only for a year." He warned, "We need to see how it goes."

Within a few weeks, I was invited to a meeting with HSBC. I still, to this day, have no idea how they'd even heard of Green-Works. We were a tiny company with no marketing budget. I went along with my graduate employee, Chris Triggs. I'd had my operation by then, so I was on crutches with a full leg plaster. As I often say to people, the entirety of Green-Works went to see HSBC, all three working legs!

We were taken up into the boardroom of the old Midland Bank, a very august, beautiful oak-panelled room with wonderful mahogany furniture. We met the Senior Procurement Manager, who had travelled down from Sheffield, and the CSR manager.

The two talked about the imminent completion of their new headquarters at Canary Wharf. They explained how they would like me to help them with the furniture made redundant as staff moved out of their old offices. I remember how I naively asked them if they were letting out most of that huge building, and they said, "No, no, that's our new headquarters. We intend to move everything out of the City of London into that new tower in Canary Wharf."

At that point, the penny dropped. These men wanted Green-Works, this tiny organisation with one part-time employee, a rented van and no office, to take on what would end up being the largest commercial office clearance in Europe and possibly the history of the world.

How would I respond? At this point, the mission statement I'd outlined to Peter Lehman all those weeks before came into play. The words echoed through my mind as I formulated my answer. When would I ever get such a golden opportunity to deliver on the mission I'd set out then? If I wasn't going to do it now, when would I ever do it?

Of course, it was ludicrous. We completely lacked the financial, physical and logistical capacity, experience or knowledge to take on such a task. We could not dispose of the furniture. We had no marketing. We had no market. We couldn't conceivably do it. Up to this point, we'd handled probably 170 desks in total. This contract would require us to handle 7000!

Frankly, it wasn't and shouldn't have been conceivable. However, there it was. These two experienced senior managers in HSBC asked if I would take it on. I said, "Yes, I would, but I'd need some financing upfront. As you can see, we're a tiny organisation, but we have the will, and if you help us with the finances, we'll do it."

That set-in train the extraordinary set of events described in this book. It enabled Green-Works to get on the map, and it all started with a very clear mission statement.

Great Mission Statement Examples
Divine Chocolate: "We exist to help end exploitation in the cocoa industry. We champion the needs of farmers, enabling them to thrive and prosper and together build a sustainable and fair world."
Google: "To organise the world's information and make it universally accessible and useful."
Câr-y-Môr: "Câr-y-Môr is committed to starting the first commercial seaweed and shellfish farm in Wales to motivate and inspire others to duplicate. This zero-input farming uses no fertiliser, pesticides or freshwater. Our goal is to improve the coastal environment and the well-being of the local community. We aim to stimulate jobs and give people a route into the Welsh seafood sector, an industry of growing national importance."
Change Please: "We want a world where homelessness is reduced through trade, its stigma is eliminated, and people experiencing homelessness remain valued members of society."
Tesla: "Accelerating the World's Transition to Sustainable Energy"

In all these examples it's clear that the objectives the company has are not simply financial or economic. The owners and leaders of these organisations want to achieve something bigger, and they are using business to enable them to achieve that. Whether it's in the commercial or not-for-profit sector, having a clear mission statement or a mountain to climb will help focus your energies.

What's Your Mission?
In the following section, you will work out what your mission statement could be. As Figure 1 shows, there are many reasons why people run businesses.

Figure 1: What's Your Mission?
I appreciate that you may regard the idea of having a mission statement as marketing fluff. In many cases, that's exactly what it is. However, if used properly, a mission statement can and should give you and the organisation a real sense of direction.

It also helps you make choices. For instance, Tesla would not engage in any activities relating to carbon-emitting energies or, any activities that slow down the transition to sustainable energy. At Change Please, the mission statement is to reduce homelessness through trade. That's a very clear statement of intent. It isn't trying to raise charitable funds to provide housing. It's specifically there to enable individual homeless people to improve their well-being and their material wealth through trade. New opportunities to trade would fit the mission, but charity fundraising would not.

Having a mission statement has given me a clearer sense of direction. The clarity that a well-drafted mission statement can give will make many of your business decisions much easier. It can also provide a clearer narrative to potential employees when recruiting. Additionally, it can help you make a compelling case when raising money from investors and funding organisations.

How Do You Create a Mission Statement?
Whether you're just starting your business or it's relatively mature and employing staff, getting others involved in drafting a mission statement is a good idea.

This draws out the combined experience of everyone around you and helps you clarify what's truly important. For employees, it engages them all and attracts them to an agreed mission. It also helps to better understand what motivates them to come to work.

In essence, to successfully make the climb, you need to map a journey that answers three fundamental questions, as shown in Figure 2.
Figure 2: Create Your Mission Statement

Exercise 2: Create a Mission Statement
Work with others on your team to answer the three questions in this table. It's extremely useful to enable a team discussion on each of these points. Psychologically, it's vital that every team member has an opportunity to contribute to the mission statement.

It's also beneficial to hear the differing perspectives to better understand how individual team members relate to the company and what is important to them.

Defining these three aspects can be difficult, and it may take a few attempts to hone them, but I promise, it's worth the effort.`,
      summary: "Understanding your business's direction is crucial for making strategic decisions and maintaining focus.",
      quote: "Your mission isn't just about what your business does, but about the impact you want to create in the world."
    },
    {
      id: 3,
      title: "CHAPTER 3: TIMELINE",
      theme: "Planning",
      content: `I found that the best way to answer the question "How do I get somewhere?" is to imagine being there in the first place and working backwards.

It's not an easy process to do. It requires you to use all your imagination to project a desired future and simultaneously push aside the realities of your current situation.

Most people start from where they currently are and obsess about the next one or two steps forward, in other words, the things that are causing them immediate challenges. In approaching the problem that way, I've found that it stunts people's ambition. The immediate issues make ambitious, longer-term objectives feel impractical and implausible.

Future-Back Thinking

By starting where you want to end up and imagining yourself in that position, you suddenly free yourself of the resource constraints that you are currently experiencing. By imagining you're already there, you create a scenario where you have the necessary resources, staff and facilities. It's much easier to look back from there and ask, "How did I get here?"

As you work backwards to your current position, you can see more readily what would have to change to get you to the place you're looking back from. Hopefully, this example from my experience will help you visualise this.

🔎Case Study
My ambition for Green-Works was to make a significant difference in the amount of office furniture sent to landfill. It was clear that the finance sector and related services were disposing of the majority of office furniture. Therefore, to make that significant difference, I would have to have a capability in all the places where the finance industry was based.

Although the finance sector is predominantly based in London, we realised that back offices and support facilities were located in several cities across England and Scotland, particularly around Birmingham, Leeds, Edinburgh and Bristol.

Our clients were national organisations, and they had offices across the entire country. If Green-Works was to succeed and secure contracts with these large organisations (and, in turn, deliver on our mission), we would have to be able to offer a service nationally.

The challenge then was to work out how we could go national. We were a tiny organisation with no capital funding. We were a not-for-profit company, i.e., one limited by guarantee with no shares. This meant that we were unable to attract investment. How could we expand our warehouse footprint across the nation?

Having worked out where we wanted to be, we needed to work out how to get there. The most obvious answer was to franchise. Working backwards, the next question was how and who to franchise with.

The 'who' was relatively easy. Several socially-minded organisations across the country recycle domestic furniture for poverty relief in the community. We thought talking to them about increasing their capacity and recycling office furniture would be relatively straightforward.

Thinking back from the 'who,' we had to determine what they would need from us. One element would be a fully written down operational system. This had to be accompanied by a training manual to instruct the franchisee's staff team.

To create a franchise operations manual, we needed to develop our own internal manual. We would also have to consider how we would work with the franchisees regarding communication and support.

We also realised that we would have to increase our national sales capacity and develop our partnerships with national logistic organisations that could support us.

Using the 'future-back' model, we could track back from a future position of a national network of warehouses to what we would need to focus on in the next 6–12 months to convert our dream into reality.

The fully equipped mountaineer, shown in Figure 3, can describe in detail the equipment she needed, as well as the physical and mental training she had to undertake to climb the mountain.

It's much more intimidating and challenging to imagine what's required to climb a mountain if your perspective is that of the day-tripper hiking through the hills.

Figure 3: The View Is Clearer From the Top

Exercise 3: Use Future-Back Planning
Please use the scale on the following page to work back from your desired goal. Firstly, visualise yourself achieving the goal at the end of the scale.

Now, think about where you would be one year before that moment.

What resources did you have? What did your organisation look like? What size and type of customers did you have?

In short, what do you think you need at that point to take the final step towards your goal? Visualise what that point would have looked like and think through the situation a year before, which made this place possible.

Repeat the process above to go back up to 6 years until you hit the present time.


⚙️Resource
Future-back thinking can be tough at first. I'd be delighted to help you get started.
Book a free online session with me on how to think 'future-back.' Contact me by going to this link:
intentionality.co.uk/contact (type this offer code into the subject line: FUTBACK24)`,
      summary: "Understanding how to plan backwards from your goals helps create realistic roadmaps for success.",
      quote: "Start with where you want to end up and work backwards - it's easier to see the path when you're looking down from the summit."
    },
    {
      id: 4,
      title: "CHAPTER 4: EXIT STRATEGY",
      theme: "Planning",
      content: `As I look back on my early business career, one of the biggest mistakes I made was not having an idea about what would happen when my business ended.

I just imagined that I would be the boss, and it would just keep going. When you stop to think, that isn't very realistic. If you're lucky, you will get old and want to retire. However, many things could happen that make you unable or unwilling to run your business long before then.

An exit strategy is not just a plan for things going wrong or when you get too old. It's a positive concept which can give you a powerful sense of direction.

As we've seen in the previous chapter, a sense of direction helps dictate your strategy and how you allocate resources and manage the business in ways that help you achieve your aims.

There are several potential exit strategies.

Retire and Close
This is probably the most sensible option for very small companies entirely dependent on the founder.  However, for even a slightly larger company where other people share responsibility for running the business, it feels wasteful not to look to preserve it beyond your working life. Do you really want the organisation you have put so much effort into to stop existing when you retire? If you become infirm, do you want all that hard work to disappear?  Without a strategy and a plan for succession, that is, sadly, the most likely scenario.

Sell
One of my clients, Umesh, had a crystal clear vision of a trade sale for his business. He envisaged an exit strategy before he even began his business, as the following story explains.

🔎Case Study
"From the very start of conceiving my business, I was keen to have a concrete vision for the end goal.  I'd seen (and worked for) far too many businesses stumble along, promising their employees 'jam tomorrow' that never ultimately crystallises.

In my case, I knew that we would be targeting an exit (of some description) within seven years.  Having a valuation in mind was helpful, as was thinking through what the likely exit route was.  The former helps to work backwards to design yearly plans (revenue, headcount, expenditure, etc.), and the latter helps refine the business model.

In my case, we knew we were likely targeting a trade sale — mainly because it's a tough niche for large incumbents to crack, so they are pretty acquisitive when an interesting proposition comes along.

Having that 'end goal' in mind is also a seriously powerful tool for attracting, retaining and motivating staff. When they know where the goalposts are, i.e., why the business is doing what it's doing, where the incentives lie for them, why we move at the pace we do and demand what we do from them, they can buy into the vision and give 100%.

The other benefit is that it encourages you, as a founder, to operate at a 'best practice' level. Those bad habits that small business owners often pick up just won't fly if you're targeting a sale to private equity or a complex acquirer, especially if your end goal is to take the business public."

Employee Buyout
Many owners decide to sell their business to their senior management teams instead of an outside buyer. In this way, they hope to keep the people who know the business and motivate them to work even harder.  However, this can be a challenging and arduous process to complete. Check out the Resources section at the end of this chapter for a revealing article on employee buyout.

Pass On to Family
Another popular exit strategy is to pass the business on within the family, as seen in the following case study.

🔎Case Study
Bernie Suresparan drives his business, We Care Group, along three core values: family, honesty and respect. It's no surprise, therefore, to hear that he fully intends to pass on the business to his two children.

In his mid-60s, with no sign of wanting to retire anytime soon, Bernie is preparing for his children to take over. They are already involved in the company's running and are rapidly gaining experience in how it works.

The business is complex, and it's difficult to predict when his children will be ready to take over the reins, so he has made provision for bringing in a more experienced chief executive as an interim step towards their taking over.

This is a good example of solid succession planning for a business, which Bernie clearly sees as a positive legacy and a valuable contribution to North West England.

Bernie explains, "Our people make our business successful, and we are proud to have the best people in our company. We can only achieve continued success by good succession planning, which is what I am concentrating on. We believe in making this company an employer of choice in the next few years."

Make Redundant
For some organisations, especially in the social sector, there is a final type of exit strategy. The following case study from founder and trustee Georgie Fienberg explains how AfriKids and their True Empowerment model is an excellent example.

"AfriKids is a British charitable organisation set up 'to ensure that every child in Ghana is afforded his or her rights as outlined in the United Nations Convention on the Rights of the Child and to do this by building the capacity and resources of local people, organisations and initiatives in such a way that they will be able to continue their efforts independently and sustainably in the future.

Initially, most funding decisions were made by an office in London. However, over 25 years, the organisation has reversed that. Today, almost all decisions are made in AfriKids Ghana, where a dedicated team of over 100 staff drives the organisation's mission forward compared to the London offices' seven.

This local team has developed self-sustaining projects and grown its partnerships and fundraising capacity, a true testament to the power of local empowerment and the success of AfriKids' model.

AfriKids is now redefining its mission. It feels that it can replicate the model of local empowerment and take it to other communities across Africa.

Our intentional planning to shift the power to AfriKids Ghana has been pivotal in sharpening our focus and effectiveness. By empowering our Ghanaian team to lead and make critical decisions, we've not only ensured that our initiatives are deeply rooted in local context and needs but also fostered a sense of ownership and sustainability that drives our mission forward with unparalleled dedication and clarity."

Figure 4: What's Next?

Exercise 4: Define Your Exit Strategy
Imagine reaching your business goal, or at the very least, you've gone as far as you can towards it. As you look around and survey the future, what would you like to do with your life beyond that goal? What would you like to happen to your business?

With that future in mind, I invite you now to take the Exit Strategy Challenge.

If you can answer each of these questions in detail, you're on your way to a genuine plan for exiting your business and realising that future.

Remember, a strategy without a plan and resources is only a dream.

⚙️Resource
There are several excellent resources on the internet about how to devise an exit strategy particularly for selling a business and realising its value.

Check out these ones that I've found for you:

You can find all these sites by scanning this QR code:`,
      summary: "Planning your exit strategy is crucial for long-term business success and sustainability.",
      quote: "An exit strategy isn't just about ending - it's about creating a meaningful legacy for your business."
    },
    {
      id: 5,
      title: "CHAPTER 5: FUTURE-FIT PLANNING FOR SUSTAINABILITY",
      theme: "Planning",
      content: `I strongly recommend including environmental and social considerations in your business planning from the very beginning of your entrepreneurial journey. You might find yourself wondering, "Why? What impact can a small company truly make?" Firstly, I've seen first-hand how even small companies can influence major companies with fresh ideas. Secondly, small companies are often much closer to their communities and can offer direct support in ways larger organisations cannot. And lastly, as your company grows, so will the impact and reach of your ideas.

Let's start with the undeniable truth: social and environmental challenges are shared global issues. Whether it's climate change, resource depletion or social inequality, these problems affect us all. We all have a role to play in addressing them. Yes, your individual contribution might seem modest in the grand scheme, but collectively, the actions of small businesses add up to powerful change.

However, let's go beyond altruism. As Figure 5 illustrates, businesses are being pushed and cajoled to do more on these issues. There are six compelling reasons why taking environmental and social performance seriously should be a core part of your business strategy:

1. Business holds the key.
2. The cost of inaction is rising.
3. Regulations are coming in thick and fast.
4. Customers want and expect it.
5. Staff want it!
6. The competition is doing it.

These reasons aren't just about doing good — they're about ensuring the long-term resilience of your business, deepening engagement with your customers and employees, and positioning your company for growth in an evolving market.

As you navigate the entrepreneurial landscape, you'll discover that businesses embracing sustainability and social responsibility are more adaptable to disruptions, more attractive to talent, and more trusted by customers. In a world where environmental crises and social demands are reshaping how we live and work, the businesses that succeed will be those that take proactive, thoughtful steps to address these challenges.

The following chapter explores how planning for environmental and social issues can enhance your business's resilience, secure continuity and foster meaningful connections with the people who matter most — your staff and your customers.

Business Holds the Key

Businesses hold the key to a cleaner, healthier and Net Zero world. They play a critical role because they are both the cause and solution to many of the world's significant challenges. Small businesses, in particular, are the driving force behind innovations that can improve lives and be kinder to the environment. They have the competitive incentive to reduce input and operating costs while creating products that are easier and cheaper for their customers to use. The products and services they produce are responsible for nearly one-fifth of the UK's carbon emissions. In short, every business needs to get involved.

This is undoubtedly the view of the UK Government. In May 2021, it launched the Together For Our Planet Business Climate Leaders Campaign.

In its press release at the launch, the SME Climate Hub said, "The United Kingdom alone has six million SMES, which generate £2.2 trillion of revenue to the economy, making them essential on the road to net-zero, and a community that cannot be left behind as we transition to the green economy… the UK Government is calling on companies of all sizes to join the SME Climate Hub and the Race to Zero and establish plans to meet their commitments… [and] to encourage small businesses to halve their emissions by 2030 in line with the Paris Agreement and cut their emissions to net zero by 2050 or sooner."

Businesses play a pivotal role in shaping the environment due to their considerable influence on resource consumption, emissions and innovations. They are among the largest consumers of natural resources and primary producers of waste and emissions. Due to their scale, even small shifts in business practices can have a broad environmental impact.

When businesses choose sustainability, they set a path for others to follow, making environmental progress both scalable and impactful.

The Cost of Inaction Is Rising

Aside from pleasing your staff, there's a real cost to not doing anything on the environmental front. For example, look at the cost of waste disposal and the tax imposed on waste you send to landfill. This has gone up exponentially since it was introduced in 1990. At that time, it was £7 per tonne. If the annual rate of increase had stuck with inflation, it would now be something like £14 per tonne. As of April 2024, it is £103.70 per tonne!

The government has accelerated the rate of increase, partly to earn some revenue but mainly to deter organisations from putting their waste into landfill.

Regulations Are Coming Thick and Fast

Everywhere you look as business owners, you can see new regulations popping up. It could be new parking restrictions or regulations about what vehicles can be driven into parts of the city. It could be the Biodiversity Net Gain regulations for developers or the bans and restrictions of single-use plastics.

These regulations are coming in thick and fast. To stay in business, let alone thrive, you need to comply with all these regulations. You need to get on the front foot and meet them head-on.

There is an excellent book on this subject especially for micro and small businesses.
It really is …just good business by Jill Poet offers a pragmatic, common-sense approach to operating a business more sustainably. It will help you identify the main areas where you can have the biggest impact and focus your attention on what really matters.

Figure 5: Change Is Imminent

Customers Want and Expect It

This is probably the biggest driver for most small businesses to adopt new environmental or social practices. If you're dealing with large corporate organisations or public bodies, you will already see questions from them about your environmental performance.

This is set to increase dramatically. The NHS, for example, has a 'Net Zero by 2040' plan, which requires contractors and subcontractors to meet the same standard. Very soon, no organisation will be able to contract with the NHS unless it can demonstrate that it's on the path to 'Net Zero by 2040.'

The same applies to contractors and subcontractors to corporate organisations such as Unilever. They're setting their own standards and targets and expect their suppliers to match them. Otherwise, they will not be allowed to supply them.

This pressure from large corporate bodies and public sector organisations will force almost all enterprises to adopt more stringent, effective, pro-environment, pro-social policies and put them into practice. It will become an expectation of business, if it's not already, as the following case study demonstrates.

🔎Case Study
One of our corporate partners at Green-Works was a company called Interface. They are a massive, multinational, $1bn+ turnover company that manufactures carpet tiles. They are extremely progressive in their environmental ambitions and were significantly ahead of the curve in terms of aspiration to become net zero and fully sustainable.

In 1994, Interface founder Ray Anderson described the experience of reading Paul Hawken's The Ecology of Commerce as an epiphany, his "spear in the chest" moment that changed his perspective on business and sustainability.

We were a natural fit as Green-Works could reuse redundant tiles, and they could advertise our service of providing high-quality reused tiles to local charities. They could take the credit, and we could get the work.

However, talking to their salespeople made me realise the other and potentially more significant benefit of our relationship.

As I was briefing the sales team on what we did, they became very enthusiastic. One of them told me that our partnership would make their job so much easier because they could broaden the conversation and start talking about something other than carpet tiles, which are an essential but mundane product.

Now, they could start talking about projects in Sierra Leone, the charities that we supported, and the employment the company had created.
It's so much more interesting and more engaging for the client as well. If it's good enough for professional, experienced sales teams, then it's good enough for me. Broadening the conversation and taking it to an environmental and human level makes customer retention a lot easier.

If you're in a business-to-consumer business, there is clear evidence that more and more consumers want to see strong ethical and environmental credentials in what they buy.
A combined McKinsey/NielsenIQ analysis of US sales data over five years to June 2022 showed that products making environmental and social-related claims accounted for 56% of all growth.  They reported that products making these claims averaged 28% cumulative growth over the five-year period versus 20% for products that made no such claims.

This data shows that actual spending follows previous McKinsey US consumer sentiment surveys, which showed that more than 60% of respondents said they'd pay more for a product with sustainable packaging. A recent study by NielsenIQ found that 78% of US consumers say that a sustainable lifestyle is important to them.

Staff Want It!
Whether you're aware of it or not, your staff likes being socially and environmentally conscious, as the following case study proves.
🔎Case Study
You may recall an earlier case study in this book where, through Papercycle, I set up a paper recycling project for Mike Tregent for the BBC.
I called Mike two months after the scheme had started. He told me that, in the last 25 years, no one in the building had ever thanked him for anything he had done for them. However, since he had implemented the paper recycling scheme, he had received no end of thank yous. He explained, "I've lost count. It's quite extraordinary. Thank you for helping me set this up."
Mike's feedback proved how popular environmental initiatives can be with staff.

The lesson from this case study is that your staff like to feel that they're doing their bit for the environment, especially when it's explained to them.

The Competition Is Doing It
Business competitors are increasingly adopting environmental and social actions to differentiate themselves in the market. For instance, many restaurants in the UK now routinely offer to package leftovers for customers, which helps reduce food waste. Similarly, small retail businesses are introducing refill stations for household and personal care products, encouraging customers to reuse containers and minimise single-use plastic.

Some independent gyms and fitness studios are transitioning to renewable energy sources to power their facilities. Meanwhile, airlines are incorporating carbon offset options to appeal to eco-conscious travellers. Business clients are demanding higher levels of environmental performance from their supply chains. Many smaller businesses are responding by publishing detailed sustainability reports demonstrating their commitments. We also see more direct responses, such as packaging suppliers offering biodegradable or compostable materials.

These initiatives address environmental issues, enhance brand image and attract customers who prioritise sustainability in their choices.`,
      summary: "Understanding environmental and social impact is essential for building businesses that thrive in the long term.",
      quote: "Small shifts in business practices can have a broad environmental impact."
    },
    {
      id: 6,
      title: "CHAPTER 6: FUTURE-FIT BUSINESS MODEL CANVAS",
      theme: "Planning",
      content: `Having decided in Chapter 4 where you want to go and what you aim to achieve with your business, it's time to determine how you'll get there. This is where a well-thought-out business model comes in. A business model isn't just a framework for making money; it's the blueprint for how your business will create value, deliver it to your customers, and sustain itself over time.
But there's more to it than just the numbers. As I illustrated in Chapter 5, aligning it with environmental and social concerns is essential. Integrating these concerns into your business model will build a positive reputation for operating responsibly, thereby building trust and creating long-term resilience.
This chapter will guide you through crafting a business model that balances your ambitions with your responsibilities, ensuring your path to success is both achievable and sustainable.
A business model is very different from a plan. The plan gives you an idea of where you want to go and what you want to achieve. The business model is subtly yet significantly different to the plan. It shows the how.
By developing your business model, you will gain a deeper understanding of  your customers' wants and exactly what you need to do to meet those wants.
You'll be able to see how to reach those customers. You will better understand what you need to say when you do reach them. You'll also work through the precise financial arrangements for working with your customer group.
At the end of  this Chapter you will find a blank template for a Future-Fit Business Model Canvas. This is a powerful tool for encapsulating the vital essence of your business on one page. It's deceptively simple as it does not require reams of text, unlike a traditional business plan. It requires a keen and intuitive understanding of what makes your business work and why customers trade with you.
In my Future-Fit Business Model Canvas, you will see that the model is set within the limits of our planet. This is to serve as a reminder that your model needs to be resilient and flexible enough to operate within an increasingly challenging backdrop of environmental and societal change. To be successful, you need to embed your plans for adapting to these changes into your business model. The likely changes we will face over the coming years are substantial, and not planning for their consequences could be disastrous to you and your business.
Orientation
The ideal place to start is on the right-hand side, with Customer Segments. This is probably the most critical thing you'll do in business: understand your customer.
It's all about taking a human-centric approach to business. Even in a large organisation, there are only a few people who make buying decisions. It pays to get to know them, what they're concerned about and what makes them tick.
What do they want from you? I don't mean literally what product or service, but what standards will they assess you by. Knowing what they really want from you is the key to understanding and developing your business. We'll delve into that in more detail in the next 'Who Is Your customer' section.
Having described the customer, move to the centre and complete the Value Proposition box. There you can insert the mission statement that you worked on in Chapter 2. Below the mission statement, work out what you're going to offer to customers. The trick here is to compare your value proposition to what you've said customers really want.
Once these two boxes are aligned, working through the others on the right-hand side of the page is relatively straightforward.
In Customer Relationships, you describe how your specific customer would want to be communicated to.  This will emerge from the insights gained from describing the customer in the Customer Segments box.
Directly linked to Customer Relationships, you will see Channels. In this box, ask yourself, "How can I reach these customers?" You need to know what your customers read, how they gain information and what events they attend.
Also, on the right-hand side, you will find Key Partners, an often neglected but essential box. All businesses, particularly those at a relatively early stage in their development, need partners. These are organisations that can offer parts of your Value Proposition that your business can't deliver or that you rely on to do your work.
It might be digital support, HR advice or a range of other things without which you would struggle.
On the left-hand side of the Future-Fit Business Model Canvas, you can see several boxes that reflect the internal workings of your organisation. In the bottom left-hand corner, you will see Key Activities. You should treat this box quite pedantically. Describe precisely what you and your organisation are physically doing. You should not add what others are doing for you or with you, but what you are doing day to day and even hour by hour. It's important you understand this, as you'll see later on.
Under Key Activities, you have Key Resources. Here, you will describe what key activities you must complete to deliver your value proposition.
These could be capital items, such as vehicles or computers, or they could be specifically qualified staff, software or compliance licences.
Supporting the entire business model is the finance. In the left-hand corner, you have the Cost Structure. Here, you need to understand and list your key costs to obtain the Key Resources you require to operate your Key Activities.
Is it rent? Is it people? Is it digital information? What are the key costs that you need to cover to deliver your service?
Next, you should consider Revenue Streams. This needs to be fully fleshed out. How are you going to generate revenue? Are you selling, renting or leasing your product? Are you providing a service? Do you charge by the hour? Do you charge by the day? Or do you charge by an outcome? Do you charge in arrears or charge in advance? How does the revenue model work?
Now that you've orientated yourself around the Future-Fit Business Model Canvas, let's return to Customer Segments. As I said earlier, I always start with the customer. It's critically important to analyse what they truly want because the rest of the Future-Fit Business Model Canvas flows directly from your understanding of the customer.`,
      summary: "Understanding your business model is essential for creating a roadmap that balances profit with purpose.",
      quote: "A business model isn't just a framework for making money; it's the blueprint for how your business will create value."
    }
  ];

  const handleNextPage = () => {
    setIsPageTurning(true);
    setPageDirection('next');
    setTimeout(() => {
      setCurrentPage(prev => Math.min(prev + 1, chapters.length));
      setIsPageTurning(false);
    }, 500);
  };

  const handlePrevPage = () => {
    setIsPageTurning(true);
    setPageDirection('prev');
    setTimeout(() => {
      setCurrentPage(prev => Math.max(prev - 1, 1));
      setIsPageTurning(false);
    }, 500);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2.0));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const toggleUI = () => {
    setShowUI(prev => !prev);
  };

  const openListenDialog = () => {
    setListenDialogOpen(true);
  };

  const getCurrentChapter = () => {
    return chapters[currentPage - 1];
  };

  const renderChapterContent = () => {
    const chapter = getCurrentChapter();
    
    return (
      <div className="p-8 font-serif max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{chapter.title}</h1>
        <div className="bg-amber-100 rounded-lg p-4 mb-6">
          <p className="italic text-amber-800">{chapter.quote}</p>
        </div>
        <div className="whitespace-pre-line">
          {chapter.content.split('\n\n').map((paragraph, idx) => {
            if (paragraph.startsWith('🔎Case Study')) {
              return (
                <div key={idx} className="bg-blue-50 p-4 rounded-lg my-4 border-l-4 border-blue-500">
                  <h3 className="font-bold text-blue-900 mb-2">Case Study</h3>
                  <p>{paragraph.replace('🔎Case Study', '')}</p>
                </div>
              );
            } else if (paragraph.startsWith('⚠️ Warning')) {
              return (
                <div key={idx} className="bg-red-50 p-4 rounded-lg my-4 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-900 mb-2">Warning</h3>
                  <p>{paragraph.replace('⚠️ Warning', '')}</p>
                </div>
              );
            } else if (paragraph.startsWith('⚙️Resource')) {
              return (
                <div key={idx} className="bg-green-50 p-4 rounded-lg my-4 border-l-4 border-green-500">
                  <h3 className="font-bold text-green-900 mb-2">Resource</h3>
                  <p>{paragraph.replace('⚙️Resource', '')}</p>
                </div>
              );
            } else if (paragraph.startsWith('Exercise')) {
              return (
                <div key={idx} className="bg-purple-50 p-4 rounded-lg my-4 border-l-4 border-purple-500">
                  <h3 className="font-bold text-purple-900 mb-2">{paragraph.split(':')[0]}</h3>
                  <p>{paragraph.split(':').slice(1).join(':')}</p>
                </div>
              );
            } else if (paragraph.startsWith('Figure')) {
              return (
                <div key={idx} className="text-center text-gray-600 italic my-4">
                  <p>{paragraph}</p>
                </div>
              );
            } else {
              return <p key={idx} className="mb-4">{paragraph}</p>;
            }
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-screen bg-stone-50">
      {showUI && (
        <div className="flex justify-between items-center p-4 bg-white border-b">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate('/dashboard/overview')}>
              <X size={20} />
            </Button>
            <h2 className="text-xl font-serif">Prosper with Purpose</h2>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleZoomOut}>
              <ZoomOut size={18} />
            </Button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <Button variant="ghost" size="sm" onClick={handleZoomIn}>
              <ZoomIn size={18} />
            </Button>
            <Button variant="ghost" size="sm" onClick={openListenDialog}>
              <Headphones size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Bookmark size={18} />
            </Button>
            <Button variant="ghost" size="sm">
              <Share size={18} />
            </Button>
          </div>
        </div>
      )}
      
      <div 
        className="flex-1 overflow-y-auto"
        style={{ 
          transform: `scale(${scale})`, 
          transformOrigin: 'top center',
          cursor: showUI ? 'default' : 'pointer'
        }}
        onClick={toggleUI}
      >
        <PageTransition 
          isAnimating={isPageTurning} 
          direction={pageDirection}
          pageNumber={currentPage}
          totalPages={chapters.length}
        >
          {renderChapterContent()}
        </PageTransition>
      </div>
      
      {showUI && (
        <div className="flex justify-between p-4 bg-white border-t">
          <Button 
            variant="outline"
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            className="flex items-center"
          >
            <ChevronLeft className="mr-2" size={16} />
            Previous
          </Button>
          
          <div className="text-sm text-gray-500">
            Page {currentPage} of {chapters.length}
          </div>
          
          <Button 
            variant="outline"
            onClick={handleNextPage}
            disabled={currentPage >= chapters.length}
            className="flex items-center"
          >
            Next
            <ChevronRight className="ml-2" size={16} />
          </Button>
        </div>
      )}
      
      <ListenDialog 
        isOpen={listenDialogOpen} 
        onClose={() => setListenDialogOpen(false)}
        chapterId={currentPage}
        chapterTitle={getCurrentChapter().title}
      />
    </div>
  );
};

export default Read;
