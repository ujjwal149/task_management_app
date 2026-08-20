"use client";

import Link from "next/link";
import { motion, type Variants } from "framer-motion";

const features = [
  {
    title: "Task Management",
    description:
      "Create, update, prioritize, and organize tasks without losing track of your work.",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    title: "Project Organization",
    description:
      "Group related tasks into projects and keep your work structured.",
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
  {
    title: "Real-time Updates",
    description:
      "Stay synchronized with task changes through real-time WebSocket updates.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    title: "Deadlines",
    description:
      "Keep upcoming deadlines visible and make sure important work stays on track.",
    color: "text-red-600",
    bg: "bg-red-500/10",
  },
  {
    title: "Role-based Access",
    description:
      "Control administrative functionality with role-based authorization.",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    title: "Responsive Design",
    description:
      "Manage your work comfortably across desktop, tablet, and mobile devices.",
    color: "text-green-600",
    bg: "bg-green-500/10",
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },

  visible: {
    opacity: 1,
    y: 0,

    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-foreground">
      {/*  NAVBAR */}

      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl"
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="text-xl text-blue-600  font-bold tracking-tight"
          >
            TaskFlow
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
            >
              Features
            </Link>

            <Link
              href="#how-it-works"
              className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
            >
              How it works
            </Link>

            <Link
              href="#about"
              className="text-sm text-muted-foreground transition-colors hover:text-blue-600"
            >
              About
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/signin"
              className="hidden text-sm font-medium transition-colors hover:text-blue-600 sm:block"
            >
              Sign in
            </Link>

            <motion.div
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                href="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Get started
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.header>

      {/* HERO*/}

      <section className="relative overflow-hidden">
        {/* Background glow */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-3xl"
        />

        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-16 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* Hero Text */}

          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="relative z-10 max-w-2xl"
          >
            <motion.div variants={itemVariants}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1 text-sm text-blue-600">
                <span className="h-2 w-2 rounded-full bg-blue-600" />
                Simple project management
              </div>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
            >
              Organize your work.
              <span className="block text-blue-600">
                Move faster.
              </span>
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg"
            >
              TaskFlow gives you one place to organize projects,
              manage tasks, track deadlines, and stay synchronized
              with your team in real time.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <motion.div
                whileHover={{
                  scale: 1.04,
                  y: -2,
                }}
                whileTap={{
                  scale: 0.97,
                }}
              >
                <Link
                  href="/signup"
                  className="block rounded-lg bg-blue-600 px-6 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
                >
                  Start for free
                </Link>
              </motion.div>

              <Link
                href="#features"
                className="rounded-lg border border-border px-6 py-3 text-center text-sm font-semibold transition-colors hover:bg-muted"
              >
                Explore features
              </Link>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-4 text-xs text-muted-foreground"
            >
              Projects, tasks, deadlines, and real-time updates in
              one place.
            </motion.p>
          </motion.div>

          {/* Dashboard Preview */}

          <motion.div
            initial={{
              opacity: 0,
              x: 60,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              x: 0,
              scale: 1,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: "easeOut",
            }}
            className="relative"
          >
            {/* Glow */}

            <div className="absolute -inset-10 -z-10 rounded-full bg-blue-500/10 blur-3xl" />

            <motion.div
              animate={{
                y: [0, -8, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-2xl"
            >
              {/* Browser header */}

              <div className="mb-3 flex items-center gap-2 border-b border-border pb-3">
                <div className="h-2.5 w-2.5 rounded-full bg-red-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-500/60" />
                <div className="h-2.5 w-2.5 rounded-full bg-green-500/60" />

                <div className="ml-3 h-7 flex-1 rounded-md bg-muted" />
              </div>

              {/* Dashboard */}

              <div className="grid gap-3 sm:grid-cols-[150px_1fr]">
                {/* Sidebar */}

                <div className="hidden rounded-lg bg-muted p-3 sm:block">
                  <div className="mb-6 h-5 w-20 rounded bg-blue-600/20" />

                  <div className="space-y-3">
                    <div className="h-8 rounded-md bg-blue-600/10" />
                    <div className="h-8 rounded-md" />
                    <div className="h-8 rounded-md" />
                    <div className="h-8 rounded-md" />
                    <div className="h-8 rounded-md" />
                  </div>
                </div>

                {/* Main */}

                <div className="space-y-3">
                  <div className="rounded-lg bg-muted p-4">
                    <div className="h-4 w-28 rounded bg-blue-600/20" />
                    <div className="mt-2 h-3 w-40 rounded bg-muted-foreground/10" />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-lg bg-blue-500/10 p-4">
                      <div className="h-3 w-16 rounded bg-blue-600/20" />
                      <div className="mt-4 h-7 w-12 rounded bg-blue-600/30" />
                    </div>

                    <div className="rounded-lg bg-green-500/10 p-4">
                      <div className="h-3 w-16 rounded bg-green-600/20" />
                      <div className="mt-4 h-7 w-12 rounded bg-green-600/30" />
                    </div>
                  </div>

                  <div className="relative h-40 overflow-hidden rounded-lg bg-muted p-4">
                    <div className="flex h-full items-end gap-2">
                      {[35, 55, 40, 70, 50, 85, 65].map(
                        (height, index) => (
                          <motion.div
                            key={index}
                            initial={{ height: 0 }}
                            animate={{
                              height: `${height}%`,
                            }}
                            transition={{
                              duration: 0.8,
                              delay: 0.5 + index * 0.08,
                              ease: "easeOut",
                            }}
                            className="flex-1 rounded-t bg-blue-600/60"
                          />
                        )
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>



      <section
        id="features"
        className="border-t border-border py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.2,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Features
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to manage your work
            </h2>

            <p className="mt-4 text-muted-foreground">
              Keep projects, tasks, deadlines, and team activity
              organized in one place.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{
              once: true,
              amount: 0.15,
            }}
            className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.2,
                  },
                }}
                className="rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-xl"
              >
                <div
                  className={`mb-4 flex h-10 w-10 items-center justify-center rounded-lg ${feature.bg} ${feature.color}`}
                >
                  ✓
                </div>

                <h3 className="text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>



      <section
        id="how-it-works"
        className="border-t border-border bg-muted/30 py-20 sm:py-24"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.6,
            }}
            className="mx-auto max-w-2xl text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              How it works
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              Start managing your work in three steps
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-8 md:grid-cols-3">
            <Step
              number="01"
              title="Create your account"
              description="Sign up and create your TaskFlow workspace."
            />

            <Step
              number="02"
              title="Create projects and tasks"
              description="Organize your work into projects and break it down into manageable tasks."
            />

            <Step
              number="03"
              title="Stay synchronized"
              description="Track changes and receive real-time updates as your work evolves."
            />
          </div>
        </div>
      </section>

      {/* CTA */}

      <section
        id="about"
        className="relative overflow-hidden border-t border-border py-20 sm:py-24"
      >
        <div className="absolute inset-0 -z-10 bg-blue-600/[0.03]" />

        <motion.div
          initial={{
            opacity: 0,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
          }}
          className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8"
        >
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get your work organized?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Create your TaskFlow workspace and start managing your
            projects and tasks today.
          </p>

          <motion.div
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >
            <Link
              href="/signup"
              className="mt-8 inline-flex rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition-colors hover:bg-blue-700"
            >
              Get started
            </Link>
          </motion.div>
        </motion.div>
      </section>



      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <p>© 2026 TaskFlow. All rights reserved.</p>

          <div className="flex gap-6">
            <Link 
              href="https://github.com/ujjwal149/task_management_app" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-600" 
            > 
              Github 
            </Link> 

            <Link 
              href="https://linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="transition-colors hover:text-blue-600" 
            > 
              LinkedIn 
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}

/* STEP */

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 30,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 0.5,
      }}
      className="text-center"
    >
      <motion.div
        whileHover={{
          scale: 1.08,
        }}
        className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white shadow-lg shadow-blue-600/20"
      >
        {number}
      </motion.div>

      <h3 className="mt-5 text-lg font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </motion.div>
  );
}