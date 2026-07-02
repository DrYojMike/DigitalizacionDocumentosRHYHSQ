"use client";

import Link from "next/link";
import { useAuth } from "@/app/context/AuthContext";
import { useState } from "react";
import { FaFileAlt, FaUserCircle, FaBars, FaTimes, FaChevronDown } from "react-icons/fa";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (loading) {
    return (
      <header className="h-16 bg-white border-b-2 border-red-600 flex items-center px-8">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-10 h-10 bg-red-600 rounded-lg" />
          <div className="w-32 h-4 bg-gray-200 rounded-full" />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-red-600 shadow-lg shadow-red-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-md shadow-red-300/50 group-hover:shadow-red-400/70 transition-all duration-300 group-hover:scale-105">
            <span className="text-white text-lg font-bold">D</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-xl font-bold text-red-600">
              Docu
            </span>
            <span className="text-xl font-bold text-black">
              Digital
            </span>
          </div>
        </Link>

        {/* MENÚ - Solo visible si está logueado */}
        {/* {user && (
          <nav className="hidden md:flex items-center gap-1">
            <Link 
              href="/dashboard" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
            >
              Mis Documentos
            </Link>
            <Link 
              href="/archivos" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
            >
              Archivos
            </Link>
            <Link 
              href="/compartidos" 
              className="px-4 py-2 rounded-lg text-gray-700 hover:text-red-600 font-medium hover:bg-red-50 transition-all duration-200"
            >
              Compartidos
            </Link>
          </nav>
        )} */}

        {/* ACCIONES */}
        <div className="flex items-center gap-3">
          {user ? (
            <>
              {/* Usuario con dropdown */}
              <div className="relative hidden sm:flex items-center gap-2">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 transition-all duration-200 border-2 border-transparent hover:border-red-200"
                >
                  <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center text-white font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user.name?.split(" ")[0] || "Usuario"}
                  </span>
                  <FaChevronDown className={`text-gray-400 text-xs transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border-2 border-red-100 overflow-hidden">
                    <div className="py-1">
                      <Link 
                        href="/perfil" 
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUserCircle className="inline mr-2 text-red-600" />
                        Mi Perfil
                      </Link>
                      <hr className="border-red-100" />
                      <button
                        onClick={() => { logout(); setDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors duration-200"
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Botón Salir (mobile) */}
              {/* <button
                onClick={logout}
                className="hidden sm:block px-5 py-2 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md shadow-red-300/30 hover:shadow-red-400/50"
              >
                Salir
              </button> */}

              {/* Hamburguesa (mobile) */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg border-2 border-red-200 hover:bg-red-50 hover:border-red-400 transition-all duration-200"
              >
                {mobileMenuOpen ? (
                  <FaTimes className="text-red-600 text-lg" />
                ) : (
                  <FaBars className="text-red-600 text-lg" />
                )}
              </button>
            </>
          ) : (
            /* Botón Iniciar sesión */
            <Link
              href="/login"
              className="px-6 py-2.5 rounded-lg text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-all duration-200 shadow-md shadow-red-300/30 hover:shadow-red-400/50 hover:scale-105"
            >
              Iniciar sesión
            </Link>
          )}
        </div>
      </div>

      {/* MENÚ MOBILE */}
      {mobileMenuOpen && user && (
        <div className="md:hidden bg-white border-t-2 border-red-200 shadow-xl">
          <nav className="px-6 py-6 flex flex-col gap-2">
            {/* <Link 
              href="/dashboard" 
              className="px-5 py-3.5 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center gap-3 border-2 border-transparent hover:border-red-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaFileAlt className="text-red-600" />
              Mis Documentos
            </Link>
            <Link 
              href="/archivos" 
              className="px-5 py-3.5 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center gap-3 border-2 border-transparent hover:border-red-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaFileAlt className="text-red-600" />
              Archivos
            </Link>
            <Link 
              href="/compartidos" 
              className="px-5 py-3.5 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center gap-3 border-2 border-transparent hover:border-red-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaFileAlt className="text-red-600" />
              Compartidos
            </Link>
            <Link 
              href="/perfil" 
              className="px-5 py-3.5 rounded-lg text-gray-700 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium flex items-center gap-3 border-2 border-transparent hover:border-red-200"
              onClick={() => setMobileMenuOpen(false)}
            >
              <FaUserCircle className="text-red-600" />
              Mi Perfil
            </Link> */}
          </nav>
        </div>
      )}
    </header>
  );
}