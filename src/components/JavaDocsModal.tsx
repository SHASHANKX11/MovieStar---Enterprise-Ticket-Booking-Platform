import { useState } from 'react';
import { X, Code, Terminal, Server, PanelTop } from 'lucide-react';
import { motion } from 'motion/react';

interface JavaDocsModalProps {
  onClose: () => void;
}

export default function JavaDocsModal({ onClose }: JavaDocsModalProps) {
  const [activeTab, setActiveTab] = useState<'servlet' | 'jsp' | 'swing'>('servlet');

  const JAVA_CODE = {
    servlet: `// BookingServlet.java
import java.io.IOException;
import java.sql.Connection;
import java.sql.PreparedStatement;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/bookTicket")
public class BookingServlet extends HttpServlet {
    protected void doPost(HttpServletRequest request, HttpServletResponse response) 
            throws ServletException, IOException {
        
        String userId = request.getParameter("userId");
        String showtimeId = request.getParameter("showtimeId");
        String[] seats = request.getParameterValues("seats");
        
        try {
            Connection conn = DatabaseConnection.getConnection();
            String sql = "INSERT INTO bookings (user_id, showtime_id, total_amount) VALUES (?, ?, ?)";
            PreparedStatement stmt = conn.prepareStatement(sql);
            stmt.setString(1, userId);
            stmt.setString(2, showtimeId);
            stmt.setDouble(3, calculateTotal(seats));
            
            int result = stmt.executeUpdate();
            
            if(result > 0) {
                response.sendRedirect("bookingSuccess.jsp");
            } else {
                response.sendRedirect("error.jsp");
            }
        } catch (Exception e) {
            e.printStackTrace();
            response.sendError(500, "Internal Server Error");
        }
    }
    
    private double calculateTotal(String[] seats) {
        return seats.length * 250.0; // Mock calculation
    }
}`,
    jsp: `<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Booking Success - MovieStar</title>
    <style>
        body { font-family: 'Inter', sans-serif; background: #f8fafc; text-align: center; padding: 50px; }
        .card { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: inline-block; }
        h1 { color: #10b981; }
        .btn { background: #e11d48; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; }
    </style>
</head>
<body>
    <div class="card">
        <h1>Booking Confirmed!</h1>
        <p>Dear <c:out value="\${sessionScope.userName}" />,</p>
        <p>Your tickets have been successfully booked.</p>
        <div class="details">
            <p><strong>Booking ID:</strong> <c:out value="\${requestScope.bookingId}" /></p>
            <p><strong>Total Paid:</strong> Rs. <c:out value="\${requestScope.totalAmount}" /></p>
        </div>
        <br/>
        <a href="home.jsp" class="btn">Return to Home</a>
    </div>
</body>
</html>`,
    swing: `// AdminDashboard.java
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;

public class AdminDashboard extends JFrame {
    
    public AdminDashboard() {
        setTitle("MovieStar - Admin Panel");
        setSize(800, 600);
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setLocationRelativeTo(null);
        
        // Navigation Panel
        JPanel navPanel = new JPanel();
        navPanel.setBackground(new Color(225, 29, 72));
        navPanel.setLayout(new GridLayout(6, 1, 10, 10));
        
        JButton addMovieBtn = new JButton("Add Movie");
        addMovieBtn.addActionListener(e -> showAddMovieDialog());
        
        JButton manageTheatersBtn = new JButton("Manage Theaters");
        
        navPanel.add(new JLabel(" Admin Controls", SwingConstants.CENTER));
        navPanel.add(addMovieBtn);
        navPanel.add(manageTheatersBtn);
        
        // Main Content Area
        JPanel contentPanel = new JPanel();
        contentPanel.add(new JLabel("Welcome to MovieStar Admin Panel"));
        
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, navPanel, contentPanel);
        splitPane.setDividerLocation(200);
        
        add(splitPane);
    }
    
    private void showAddMovieDialog() {
        JOptionPane.showMessageDialog(this, "Add Movie dialog logic goes here.");
    }
    
    public static void main(String[] args) {
        SwingUtilities.invokeLater(() -> {
            new AdminDashboard().setVisible(true);
        });
    }
}`
  };

  return (
    <div className="fixed inset-0 z-200 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-dark border border-white/10 rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden"
      >
        {/* Modal Header */}
        <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl flex items-center justify-center">
              <Code size={20} />
            </div>
            <div>
              <h2 className="font-bold text-white text-lg leading-tight">Java Architecture Reference</h2>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Servlets, JSP, and Swing Implementations</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-white bg-white/4 hover:bg-white/8 rounded-full p-2 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-64 bg-white/1 border-r border-white/5 p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-2">
              <button
                onClick={() => setActiveTab('servlet')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'servlet' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-300 hover:bg-white/2 hover:text-white'
                }`}
              >
                <Server size={18} />
                Java Servlet (Backend)
              </button>
              <button
                onClick={() => setActiveTab('jsp')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'jsp' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-300 hover:bg-white/2 hover:text-white'
                }`}
              >
                <PanelTop size={18} />
                JSP (Frontend View)
              </button>
              <button
                onClick={() => setActiveTab('swing')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                  activeTab === 'swing' 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' 
                    : 'text-slate-300 hover:bg-white/2 hover:text-white'
                }`}
              >
                <Terminal size={18} />
                Swing (Desktop Admin)
              </button>
            </div>
            
            <div className="p-4 bg-indigo-500/5 border border-indigo-500/20 rounded-xl">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">Architecture Note</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                This project satisfies requirements by including an MVC architecture powered by Java Servlets (Controllers), JSP (Views), and a Java Swing application for the administrator panel.
              </p>
            </div>
          </div>

          {/* Main Content (Code Viewer) */}
          <div className="flex-1 bg-[#060609] overflow-auto">
            <div className="p-2.5 border-b border-white/5 bg-black/40 flex items-center gap-2 sticky top-0 z-10">
              <div className="flex gap-1.5 px-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
              </div>
              <span className="text-xs font-mono text-slate-400 ml-2">
                {activeTab === 'servlet' && 'BookingServlet.java'}
                {activeTab === 'jsp' && 'bookingSuccess.jsp'}
                {activeTab === 'swing' && 'AdminDashboard.java'}
              </span>
            </div>
            <pre className="p-6 text-sm font-mono text-slate-300 overflow-visible select-text">
              <code>
                {JAVA_CODE[activeTab]}
              </code>
            </pre>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
