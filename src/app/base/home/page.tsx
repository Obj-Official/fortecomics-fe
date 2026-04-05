'use client';

import Image from "next/image";
import React, { useState }  from "react";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import {
  Box,
  Grid,
  CircularProgress,
  Typography,
  IconButton,
} from '@mui/material';
 
const slides = [
  {
    title: "Legend of The First Flame",
    description:
      "Dubem, a final year college student is chosen by the First Flame to become its new guardian. Dubem along with friends and allies have to fight multiple villains and humanoid frost scouts ultimately leading to his final battle with Lord Frost, Re-enacting a Legendary battle which took place about a thousand years back",
    image: "Legend of the First flame BG_Flare_vs_Lord_Frost.jpg", // Replace with your actual image
  },
  // Add more slides as needed
];

const TikTokIcon = () => (
  <svg
    width="2em"
    height="2em"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.74 2.89 2.89 0 0 1 2.31-4.64 2.86 2.86 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.54-.05z" />
  </svg>
);
const characters = [
  { name: "Flare", image: "/flare.png" },
  { name: "Luminess", image: "/luminess.png" },
  { name: "Omi-Gidi", image: "/omi-gidi.jpg" },
  { name: "Tekaru", image: "/tekaru.jpg" },
];

export default function Homepage() {
    const [activeSlide, setActiveSlide] = useState(0);
    const [activeCharPage, setActiveCharPage] = useState(0);
    const totalSlides = 5;
    const totalCharPages = 5;

  return (
    <div className="w-full overflow-hidden">
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/FortePoster01.jpg"
          alt="Forte Comics Background"
          fill
          className="object-cover"
          priority
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content Container */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Navigation Bar */}
        <nav className="flex items-center justify-between px-8 py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div className="w-16 h-16 bg-white rounded-full border-2 border-white flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-orange-500">FΛ</span>
            </div>
          </div>
          {/* Menu Items */}
          <div className="flex text-xl items-center gap-12 text-white uppercase text-sm tracking-wide">
            <a href="#events" className="hover:text-orange-400 transition font-mistral">
              EVENTS
            </a>
            <a href="#campaigns" className="hover:text-orange-400 transition font-mistral">
              CAMPAIGNS
            </a>
            <a href="#forteverse" className="hover:text-orange-400 transition font-mistral">
              FORTEVERSE
            </a>
            {/* Login Button */}
            <button className="px-6 py-2 border-2 border-white text-white rounded-full hover:bg-white hover:text-black transition font-mistral text-sm uppercase">
                LOGIN
            </button>
          </div>
  
        </nav>

        {/* Hero Section */}
        <div className="flex-1 flex flex-col items-center justify-center gap-8">
          {/* Main Title */}
          <div className="text-center">
            <div className="flex items-baseline justify-center gap-4">
              <h1
                className="text-8xl font-bold text-white drop-shadow-lg"
                style={{ fontFamily: "'Bauhaus 93', serif" }}
              >
                FORTE
              </h1>
              <h2
                className="text-6xl text-orange-300 italic drop-shadow-lg"
                style={{ fontFamily: "'Mistral', serif" }}
              >
                comics
              </h2>
            </div>
          </div>
        </div>

        {/* Bottom with Social Media */}
        <div className="flex flex-col items-center justify-center gap-6 pb-12">
          <p
            className="text-white text-2xl italic uppercase"
            style={{ fontFamily: "'Mistral', serif" }}
          >
            FOLLOW US
          </p>

          {/* Social Media Icons */}
          <div className="flex gap-8 items-center">
            <a
              href="#instagram"
              className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <InstagramIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#tiktok"
              className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <TikTokIcon />
            </a>
            <a
              href="#youtube"
              className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <YouTubeIcon sx={{ fontSize: 40 }} />
            </a>
            <a
              href="#facebook"
              className="text-white hover:text-orange-400 transition duration-300 transform hover:scale-110"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FacebookIcon sx={{ fontSize: 40 }} />
            </a>
            
          </div>
        </div>
      </div>
      <div>
      </div>
      </div>

{/* parts after the main landing */}
    <Box
      sx={{
        bgcolor: "#0d0d0d",
        minHeight: "100vh",
        p: 3,
        fontFamily: "'Cinzel', serif",
      }}
    >
      {/* Header */}
      <Typography
        sx={{
          fontFamily: "'Mistral', cursive",
          color: "#fff",
          fontSize: "1.4rem",
          mb: 2,
          letterSpacing: 1,
        }}
      >
        Fandom
      </Typography>
 
      {/* Main Content */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          alignItems: "stretch",
          flexWrap: { xs: "wrap", md: "nowrap" },
        }}
      >
        {/* LEFT: Hero Slide Card */}
        <Box
          sx={{
            flex: "0 0 55%",
            maxWidth: { xs: "100%", md: "55%" },
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            minHeight: 420,
            bgcolor: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          {/* Hero Image */}
          <Box
            component="img"
            src={slides[0].image}
            alt={slides[0].title}
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          />
 
          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "70%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 60%, transparent 100%)",
            }}
          />
 
          {/* Text Content */}
          <Box
            sx={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              p: 2.5,
            }}
          >
            <Typography
              sx={{
                color: "#fff",
                fontWeight: 700,
                fontSize: "1.25rem",
                fontFamily: "'Cinzel', serif",
                mb: 1,
              }}
            >
              {slides[0].title}
            </Typography>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.82)",
                fontSize: "0.78rem",
                lineHeight: 1.6,
                fontFamily: "'Berlin Sans FB Demi', sans-serif",
                mb: 2,
              }}
            >
              {slides[0].description}
            </Typography>
 
            {/* Dots */}
            <Box sx={{ display: "flex", gap: 0.6 }}>
              {Array.from({ length: totalSlides }).map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveSlide(i)}
                  sx={{
                    width: i === activeSlide ? 10 : 8,
                    height: i === activeSlide ? 10 : 8,
                    borderRadius: "50%",
                    bgcolor: i === activeSlide ? "#fff" : "rgba(255,255,255,0.35)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    mt: "1px",
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
 
        {/* RIGHT: Characters Grid */}
        <Box
          sx={{
            flex: 1,
            bgcolor: "#1c1c1c",
            borderRadius: "16px",
            p: 2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            border: "1px solid rgba(255,255,255,0.8)",
          }}
        >
          <Grid container spacing={1.5}>
            {characters.map((char) => (
              <Grid item xs={6} key={char.name}>
                <Box
                  sx={{
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative",
                    bgcolor: "#2a2a2a",
                    cursor: "pointer",
                    "&:hover .char-img": {
                      transform: "scale(1.04)",
                    },
                  }}
                >
                  {/* Character Image */}
                  <Box
                    component="img"
                    className="char-img"
                    src={char.image}
                    alt={char.name}
                    sx={{
                      width: "100%",
                      height: 150,
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.3s ease",
                    }}
                  />
 
                  {/* Name row */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      px: 1,
                      py: 0.75,
                    }}
                  >
                    <Typography
                      sx={{
                        color: "#fff",
                        fontSize: "0.8rem",
                        fontFamily: "'Lato', sans-serif",
                        fontWeight: 500,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {char.name}
                    </Typography>
                    <Box
                      sx={{
                        flex: 1,
                        height: "1px",
                        bgcolor: "rgba(255,255,255,0.25)",
                      }}
                    />
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
 
          {/* Bottom: dots + label */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 0.8,
              mt: 1.5,
            }}
          >
            <Box sx={{ display: "flex", gap: 0.7 }}>
              {Array.from({ length: totalCharPages }).map((_, i) => (
                <Box
                  key={i}
                  onClick={() => setActiveCharPage(i)}
                  sx={{
                    width: i === activeCharPage ? 10 : 8,
                    height: i === activeCharPage ? 10 : 8,
                    borderRadius: "50%",
                    bgcolor:
                      i === activeCharPage
                        ? "#fff"
                        : "rgba(255,255,255,0.3)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </Box>
            <Typography
              sx={{
                color: "rgba(255,255,255,0.6)",
                fontSize: "0.75rem",
                fontFamily: "'Lato', sans-serif",
                letterSpacing: 0.5,
              }}
            >
              Explore in Forteverse
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
    </div>
  );
}


