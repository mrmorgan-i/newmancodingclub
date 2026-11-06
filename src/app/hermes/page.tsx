import type { Metadata } from 'next';

import Container from '@/components/Container';

import CopyCommand from './CopyCommand';

export const metadata: Metadata = {
  title: 'Set up Hermes | Newman Coding Club',
  description:
    'Set up your own AI agent, text it from your phone, and ask it what is due on Canvas.',
};

const SKILL_URL = 'https://newmancoding.club/hermes/whats-due/SKILL.md';

function Step({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-slate-200 py-10" id={`step-${number}`}>
      <h2 className="text-2xl font-bold text-foreground">
        {number}. {title}
      </h2>
      <div className="mt-4 space-y-3 text-base leading-7 text-slate-700">{children}</div>
    </section>
  );
}

function Other({ summary, children }: { summary: string; children: React.ReactNode }) {
  return (
    <details className="rounded-lg border border-slate-200 bg-white px-4 py-3">
      <summary className="cursor-pointer font-medium text-slate-800">{summary}</summary>
      <div className="mt-3 space-y-3">{children}</div>
    </details>
  );
}

function Mono({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-slate-200 px-1.5 py-0.5 font-mono text-sm text-slate-900">{children}</code>;
}

function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a href={href} className="font-medium text-primary underline underline-offset-2">
      {children}
    </a>
  );
}

export default function HermesPage() {
  return (
    <div className="bg-slate-50">
      <Container className="max-w-3xl! pb-16 pt-28">
        <p className="text-sm font-semibold text-primary">Casual Coding, November 5</p>
        <h1 className="mt-2 text-4xl font-bold text-foreground">Set up Hermes</h1>
        <p className="mt-4 text-lg leading-8 text-slate-700">
          Hermes is an AI agent that runs on your own laptop. By the end of this you can text it
          from your phone and ask what&apos;s due on Canvas. You don&apos;t need to know how to
          code, and nothing here costs money.
        </p>

        <div className="mt-6 rounded-lg border border-slate-200 bg-white p-5">
          <p className="font-semibold text-slate-900">You&apos;ll need</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li>
              A laptop with 5 GB free: Windows, Linux, or a Mac with an Apple chip. Intel Macs and
              Chromebooks won&apos;t work, so find someone to pair with.
            </li>
            <li>
              A <A href="https://chatgpt.com">ChatGPT</A> account. The free one is fine.
            </li>
            <li>
              <A href="https://telegram.org/apps">Telegram</A> on your phone. Sign up early, the
              verification text can take a while.
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <Step number={1} title="Install it">
            <p>
              Download the app from{' '}
              <A href="https://hermes-agent.nousresearch.com/desktop">
                hermes-agent.nousresearch.com/desktop
              </A>
              . On a Mac, open the download and drag Hermes into Applications. On Windows 11, open
              the <Mono>.appinstaller</Mono> file.
            </p>
            <p>
              Open Hermes. It installs the rest by itself, which takes about 5 minutes, then opens a
              short setup chat. You can answer it or press Skip setup at the bottom right. If it asks
              to look at your apps, you&apos;re allowed to say no.
            </p>
            <Other summary="On Windows 10, or you'd rather use a terminal">
              <CopyCommand
                label="Mac or Linux, in Terminal"
                text="curl -fsSL https://hermes-agent.nousresearch.com/install.sh | bash"
              />
              <CopyCommand
                label="Windows, in PowerShell"
                text="iex (irm https://hermes-agent.nousresearch.com/install.ps1)"
              />
              <p>When it finishes, close the window and open a new one.</p>
            </Other>
          </Step>

          <Step number={2} title="Sign in and say hi">
            <p>
              Click the gear at the top right, then Providers, then Accounts. Under Connect another
              provider, choose ChatGPT or Codex Subscription, and sign in on the browser page that
              opens. Hermes connects by itself.
            </p>
            <p>
              Close Settings, click New session in the sidebar, and send it a message like &quot;what
              can you do?&quot; When it answers, you&apos;re done with this step.
            </p>
            <p className="text-sm text-slate-600">
              If you get a screen that says Let&apos;s get you setup instead, click Other providers and
              choose it there.
            </p>
            <Other summary="In a terminal instead">
              <CopyCommand text="hermes model" />
              <p>
                Choose ChatGPT or Codex Subscription, open the link it gives you, and enter the
                code. Then run <Mono>hermes</Mono> to start chatting.
              </p>
            </Other>
          </Step>

          <Step number={3} title="Text it from your phone">
            <p>
              In the sidebar on the left, go to Messaging, then Telegram, then Create with QR. Scan the code with
              Telegram on your phone and confirm. Hermes makes a bot that only you can talk to.
            </p>
            <p>
              Go back to Hermes and click Save if it asks, then send your new bot &quot;hi&quot;. If it
              answers, you&apos;re texting your laptop. If it asks about a home channel, send it{' '}
              <Mono>/sethome</Mono>.
            </p>
            <Other summary="In a terminal instead">
              <CopyCommand text="hermes gateway setup" />
              <p>Choose Telegram, then Automatic, and scan the code.</p>
            </Other>
            <Other summary="On an iPhone and want iMessage instead of Telegram">
              <p>
                Hermes can use a free shared iMessage line through a service called Photon. Put your
                own number in:
              </p>
              <CopyCommand text="hermes photon setup --phone +1XXXXXXXXXX" />
            </Other>
          </Step>

          <Step number={4} title="Give it skills">
            <p>
              A skill is a text file that teaches Hermes how to do one job. It comes with 44 of
              them. Type <Mono>/</Mono> in the chat to see what you have, or try one:
            </p>
            <CopyCommand text="/youtube-content summarize https://youtu.be/your-video" />
            <p>
              To find more, go to Capabilities in the sidebar, search, and click the plus. The ones
              marked ClawHub were posted by other people, so read what they do first. The official
              flashcards skill is a good one to start with:
            </p>
            <CopyCommand text="/skills install official/productivity/memento-flashcards" />
            <p>
              You can also teach it your own. Walk it through something once, then tell it to keep
              that as a skill:
            </p>
            <CopyCommand text="/learn how I just did that" />
            <p>There are two other ways to add things, and you&apos;ll hear both words:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="font-semibold">A connector</span> (you&apos;ll also hear MCP) links
                it to another app, like Notion. They&apos;re in the Connectors tab under
                Capabilities.
              </li>
              <li>
                <span className="font-semibold">A plugin</span> is new code that gives it new tools.
                They&apos;re in the Plugins tab, and they install turned off. A
                plugin being on the list doesn&apos;t mean anyone checked its code, so read what it
                does before you turn it on.
              </li>
            </ul>
          </Step>

          <Step number={5} title="Connect Canvas">
            <p>This is a small skill the club made. Paste this in the chat:</p>
            <CopyCommand text={`/skills install ${SKILL_URL}`} />
            <p>
              Then open your <A href="https://newmanu.instructure.com/calendar">Canvas calendar</A>.
              At the bottom of the right side, click Calendar Feed and copy the link.
            </p>
            <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
              That link can only read your calendar, so it can&apos;t submit or change anything. But
              anyone who has it can see your assignments, so keep it to yourself. Don&apos;t paste it
              in a chat, because chats get sent to the AI company.
            </div>
            <p>Open a terminal, not the chat, and put your link in:</p>
            <CopyCommand text="hermes config set CANVAS_CALENDAR_URL paste_your_link_here" />
            <CopyCommand text="hermes gateway restart" />
            <p>Now text your bot:</p>
            <CopyCommand text="what's due this week?" />
            <Other summary="Want it to read your classes too, like files, readings and announcements?">
              <p>
                The calendar link only has due dates and instructions. To go further, Hermes can sign
                in to Canvas with a browser. Install this second skill in the chat:
              </p>
              <CopyCommand text="/skills install https://newmancoding.club/hermes/canvas-content/SKILL.md" />
              <p>Then in a terminal, so it stays signed in:</p>
              <CopyCommand text="hermes config set browser.user_data_dir canvas-browser" />
              <CopyCommand text="hermes gateway restart" />
              <p>Now ask it, in the app and not on Telegram, since it needs to pop up a login box:</p>
              <CopyCommand text="log into Canvas at newmanu.instructure.com/login/canvas and tell me the newest thing posted in one of my classes" />
              <p>
                Type your Canvas login in the box it shows you. Hermes says it stays encrypted on your
                laptop and the AI never sees it. If the password doesn&apos;t work, use Forgot Password
                on that Canvas page.
              </p>
              <div className="rounded-lg border border-amber-300 bg-amber-50 p-4 text-amber-950">
                Once it&apos;s signed in, it could do anything you can do in Canvas, including submit
                work. The skill tells it to only read, but that&apos;s an instruction and not a lock,
                so this one is your call.
              </div>
            </Other>
            <p className="text-sm text-slate-600">
              Canvas&apos;s calendar doesn&apos;t know what you&apos;ve already turned in, so some of what
              it lists might be done. Also, every class has its own AI rules, so check your syllabus
              before you ask it to help with the work itself.
            </p>
          </Step>

          <Step number={6} title="Get a text every morning">
            <p>Text your bot this, and it sets up the schedule itself:</p>
            <CopyCommand text="Every morning at 8, text me what's due today and tomorrow." />
            <p>
              You can see it in the app under Scheduled jobs. To stop it, just tell your bot to stop.
            </p>
          </Step>

          <Step number={7} title="Keep it running">
            <p>This makes Hermes start again by itself after you restart your laptop:</p>
            <CopyCommand text="hermes gateway install" />
            <p>
              Hermes lives on your laptop, so when your laptop is asleep your bot can&apos;t answer.
              It catches up when you open it again, and a morning text you missed shows up then.
            </p>
            <p>
              If you want it on all the time, you need a computer that stays on: an old laptop at
              home, a small cloud server, or{' '}
              <A href="https://portal.nousresearch.com/cloud">Hermes Cloud</A>, which is paid.
            </p>
          </Step>

          <section className="border-t border-slate-200 py-10">
            <h2 className="text-2xl font-bold text-foreground">If something breaks</h2>
            <div className="mt-4 space-y-3 text-base leading-7 text-slate-700">
              <p>This checks your setup and tells you what&apos;s wrong:</p>
              <CopyCommand text="hermes doctor" />
              <p>
                If ChatGPT says you hit a limit, go back to Providers and sign in with a free Nous
                account as well, then switch to one of its free models.
              </p>
              <p>
                Still stuck? Ask in the <A href="/groupme">GroupMe</A>, or bring your laptop to
                Casual Coding, every other Thursday from 7 to 8 PM in Dugan Library.
              </p>
              <p>
                To go further, Rob Dickson has a free course at{' '}
                <A href="https://showmerob.com/hermes-course/">showmerob.com/hermes-course</A>.
              </p>
              <p>
                To remove everything, run <Mono>hermes uninstall</Mono>.
              </p>
            </div>
          </section>
        </div>
      </Container>
    </div>
  );
}
